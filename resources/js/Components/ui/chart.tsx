import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
    [k in string]: {
        label?: React.ReactNode;
        icon?: React.ComponentType;
    } & (
        | { color?: string; theme?: never }
        | { color?: never; theme: Record<keyof typeof THEMES, string> }
    );
};

type ChartContextProps = {
    config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
    const context = React.useContext(ChartContext);

    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />");
    }

    return context;
}

const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        config: ChartConfig;
        children: React.ComponentProps<
            typeof RechartsPrimitive.ResponsiveContainer
        >["children"];
    }
>(({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-chart={chartId}
                ref={ref}
                className={cn(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
                    className
                )}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(
        ([, config]) => config.theme || config.color
    );

    if (!colorConfig.length) {
        return null;
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(
                        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
    .map(([key, itemConfig]) => {
        const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
            itemConfig.color;
        return color ? `  --color-${key}: ${color};` : null;
    })
    .join("\n")}
}
`
                    )
                    .join("\n"),
            }}
        />
    );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
        React.ComponentProps<"div"> & {
            hideLabel?: boolean;
            hideIndicator?: boolean;
            indicator?: "line" | "dot" | "dashed";
            nameKey?: string;
            labelKey?: string;
        }
>(
    (
        {
            active,
            payload,
            className,
            indicator = "dot",
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
            labelClassName,
            formatter,
            color,
            nameKey,
            labelKey,
        },
        ref
    ) => {
        const { config } = useChart();

        const tooltipLabel = React.useMemo(() => {
            if (hideLabel || !payload?.length) {
                return null;
            }

            const [item] = payload;
            const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const value =
                !labelKey && typeof label === "string"
                    ? config[label as keyof typeof config]?.label || label
                    : itemConfig?.label;

            if (labelFormatter) {
                return (
                    <div className={cn("font-medium", labelClassName)}>
                        {labelFormatter(value, payload)}
                    </div>
                );
            }

            if (!value) {
                return null;
            }

            return (
                <div className={cn("font-medium", labelClassName)}>{value}</div>
            );
        }, [
            label,
            labelFormatter,
            payload,
            hideLabel,
            labelClassName,
            config,
            labelKey,
        ]);

        if (!active || !payload?.length) {
            return null;
        }

        const nestLabel = payload.length === 1 && indicator !== "dot";

        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
            >
                {!nestLabel ? tooltipLabel : null}
                <div className="grid gap-1.5">
                    {payload.map((item, index) => {
                        const key = `${
                            nameKey || item.name || item.dataKey || "value"
                        }`;
                        const itemConfig = getPayloadConfigFromPayload(
                            config,
                            item,
                            key
                        );
                        const indicatorColor =
                            color || item.payload.fill || item.color;

                        return (
                            <div
                                key={item.dataKey}
                                className={cn(
                                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                                    indicator === "dot" && "items-center"
                                )}
                            >
                                {formatter &&
                                item?.value !== undefined &&
                                item.name ? (
                                    formatter(
                                        item.value,
                                        item.name,
                                        item,
                                        index,
                                        item.payload
                                    )
                                ) : (
                                    <>
                                        {itemConfig?.icon ? (
                                            <itemConfig.icon />
                                        ) : (
                                            !hideIndicator && (
                                                <div
                                                    className={cn(
                                                        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                                                        {
                                                            "h-2.5 w-2.5":
                                                                indicator ===
                                                                "dot",
                                                            "w-1":
                                                                indicator ===
                                                                "line",
                                                            "w-0 border-[1.5px] border-dashed bg-transparent":
                                                                indicator ===
                                                                "dashed",
                                                            "my-0.5":
                                                                nestLabel &&
                                                                indicator ===
                                                                    "dashed",
                                                        }
                                                    )}
                                                    style={
                                                        {
                                                            "--color-bg":
                                                                indicatorColor,
                                                            "--color-border":
                                                                indicatorColor,
                                                        } as React.CSSProperties
                                                    }
                                                />
                                            )
                                        )}
                                        <div
                                            className={cn(
                                                "flex flex-1 justify-between leading-none",
                                                nestLabel
                                                    ? "items-end"
                                                    : "items-center"
                                            )}
                                        >
                                            <div className="grid gap-1.5">
                                                {nestLabel
                                                    ? tooltipLabel
                                                    : null}
                                                <span className="text-muted-foreground">
                                                    {itemConfig?.label ||
                                                        item.name}
                                                </span>
                                            </div>
                                            {item.value && (
                                                <span className="font-mono font-medium tabular-nums text-foreground">
                                                    {item.value.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> &
        Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
            hideIcon?: boolean;
            nameKey?: string;
        }
>(
    (
        {
            className,
            hideIcon = false,
            payload,
            verticalAlign = "bottom",
            nameKey,
        },
        ref
    ) => {
        const { config } = useChart();

        if (!payload?.length) {
            return null;
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center justify-center gap-4",
                    verticalAlign === "top" ? "pb-3" : "pt-3",
                    className
                )}
            >
                {payload.map((item) => {
                    const key = `${nameKey || item.dataKey || "value"}`;
                    const itemConfig = getPayloadConfigFromPayload(
                        config,
                        item,
                        key
                    );

                    return (
                        <div
                            key={item.value}
                            className={cn(
                                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                            )}
                        >
                            {itemConfig?.icon && !hideIcon ? (
                                <itemConfig.icon />
                            ) : (
                                <div
                                    className="h-2 w-2 shrink-0 rounded-[2px]"
                                    style={{
                                        backgroundColor: item.color,
                                    }}
                                />
                            )}
                            {itemConfig?.label}
                        </div>
                    );
                })}
            </div>
        );
    }
);
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
    config: ChartConfig,
    payload: unknown,
    key: string
) {
    if (typeof payload !== "object" || payload === null) {
        return undefined;
    }

    const payloadPayload =
        "payload" in payload &&
        typeof payload.payload === "object" &&
        payload.payload !== null
            ? payload.payload
            : undefined;

    let configLabelKey: string = key;

    if (
        key in payload &&
        typeof payload[key as keyof typeof payload] === "string"
    ) {
        configLabelKey = payload[key as keyof typeof payload] as string;
    } else if (
        payloadPayload &&
        key in payloadPayload &&
        typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
    ) {
        configLabelKey = payloadPayload[
            key as keyof typeof payloadPayload
        ] as string;
    }

    return configLabelKey in config
        ? config[configLabelKey]
        : config[key as keyof typeof config];
}

// Define the theme color map
const colorMap = {
    slate: {
        light: "hsl(215, 16%, 47%)",
        dark: "hsl(215, 20%, 65%)",
    },
    gray: {
        light: "hsl(220, 9%, 46%)",
        dark: "hsl(215, 16%, 65%)",
    },
    zinc: {
        light: "hsl(240, 5%, 46%)",
        dark: "hsl(240, 5%, 65%)",
    },
    neutral: {
        light: "hsl(0, 0%, 50%)",
        dark: "hsl(0, 0%, 65%)",
    },
    stone: {
        light: "hsl(25, 5%, 45%)",
        dark: "hsl(25, 5%, 65%)",
    },
    red: {
        light: "hsl(0, 70%, 50%)",
        dark: "hsl(0, 90%, 65%)",
    },
    rose: {
        light: "hsl(350, 70%, 50%)",
        dark: "hsl(350, 90%, 65%)",
    },
    orange: {
        light: "hsl(30, 70%, 50%)",
        dark: "hsl(30, 90%, 65%)",
    },
    amber: {
        light: "hsl(40, 80%, 50%)",
        dark: "hsl(40, 90%, 60%)",
    },
    yellow: {
        light: "hsl(55, 90%, 50%)",
        dark: "hsl(55, 95%, 60%)",
    },
    lime: {
        light: "hsl(85, 70%, 45%)",
        dark: "hsl(85, 80%, 55%)",
    },
    green: {
        light: "hsl(130, 60%, 45%)",
        dark: "hsl(130, 75%, 55%)",
    },
    emerald: {
        light: "hsl(150, 60%, 45%)",
        dark: "hsl(150, 75%, 55%)",
    },
    teal: {
        light: "hsl(170, 60%, 45%)",
        dark: "hsl(170, 75%, 55%)",
    },
    cyan: {
        light: "hsl(190, 70%, 50%)",
        dark: "hsl(190, 80%, 60%)",
    },
    sky: {
        light: "hsl(205, 70%, 50%)",
        dark: "hsl(205, 80%, 60%)",
    },
    blue: {
        light: "hsl(220, 70%, 55%)",
        dark: "hsl(220, 80%, 65%)",
    },
    indigo: {
        light: "hsl(240, 60%, 55%)",
        dark: "hsl(240, 70%, 65%)",
    },
    violet: {
        light: "hsl(260, 60%, 55%)",
        dark: "hsl(260, 70%, 65%)",
    },
    purple: {
        light: "hsl(275, 60%, 55%)",
        dark: "hsl(275, 70%, 65%)",
    },
    fuchsia: {
        light: "hsl(290, 60%, 55%)",
        dark: "hsl(290, 70%, 65%)",
    },
    pink: {
        light: "hsl(325, 65%, 55%)",
        dark: "hsl(325, 75%, 65%)",
    },
};

// Helper function for creating multi-series chart config
function createChartConfig(
    categories: string[],
    colors: string[] = ["blue", "emerald", "indigo", "rose", "amber", "sky"]
) {
    const config: ChartConfig = {};

    categories.forEach((category, i) => {
        const colorName = colors[i % colors.length];
        const colorValue = colorMap[colorName as keyof typeof colorMap];

        if (colorValue) {
            config[category] = {
                label: category,
                theme: {
                    light: colorValue.light,
                    dark: colorValue.dark,
                },
            };
        }
    });

    return config;
}

// LineChart component
interface LineChartProps {
    data: any[];
    categories: string[];
    index: string;
    colors?: string[];
    valueFormatter?: (value: number) => string;
    showLegend?: boolean;
    showGrid?: boolean;
    yAxisWidth?: number;
    showYAxis?: boolean;
    showXAxis?: boolean;
    className?: string;
    curveType?: "linear" | "natural" | "monotone" | "step";
}

function LineChart({
    data,
    categories,
    index,
    colors = ["blue", "emerald", "indigo", "rose", "amber"],
    valueFormatter = (value: number) => value.toString(),
    showLegend = true,
    showGrid = true,
    yAxisWidth = 40,
    showYAxis = true,
    showXAxis = true,
    className,
    curveType = "monotone",
}: LineChartProps) {
    const config = createChartConfig(categories, colors);

    // Map our friendly curve names to Recharts' curve types
    // See: https://recharts.org/en-US/api/Line#type
    const getCurveType = (
        type: string
    ): "linear" | "monotone" | "step" | "basis" => {
        switch (type) {
            case "natural":
                return "basis"; // basis is closest to natural
            case "step":
                return "step";
            case "monotone":
                return "monotone";
            case "linear":
            default:
                return "linear";
        }
    };

    return (
        <ChartContainer className={className} config={config}>
            <RechartsPrimitive.ComposedChart
                data={data}
                margin={{ top: 16, right: 8, bottom: 16, left: 8 }}
            >
                {showGrid && (
                    <RechartsPrimitive.CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                        stroke="var(--border)"
                    />
                )}

                {showXAxis && (
                    <RechartsPrimitive.XAxis
                        dataKey={index}
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                        tick={{ transform: "translate(0, 6)" }}
                        style={{
                            fontSize: "12px",
                            fontFamily: "inherit",
                        }}
                    />
                )}

                {showYAxis && (
                    <RechartsPrimitive.YAxis
                        width={yAxisWidth}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value: number) =>
                            value.toLocaleString()
                        }
                        style={{
                            fontSize: "12px",
                            fontFamily: "inherit",
                        }}
                        tickMargin={8}
                    />
                )}

                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            indicator="line"
                            formatter={(value, name) => [
                                <span key="value" className="text-foreground">
                                    {valueFormatter(value as number)}
                                </span>,
                                <span key="name" className="capitalize">
                                    {name}
                                </span>,
                            ]}
                        />
                    }
                />

                {categories.map((category) => (
                    <RechartsPrimitive.Line
                        key={category}
                        type={getCurveType(curveType)}
                        dataKey={category}
                        strokeWidth={2}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                        stroke={`var(--color-${category})`}
                        dot={false}
                    />
                ))}

                {showLegend && (
                    <ChartLegend
                        content={<ChartLegendContent />}
                        wrapperStyle={{ paddingTop: "16px" }}
                    />
                )}
            </RechartsPrimitive.ComposedChart>
        </ChartContainer>
    );
}

// PieChart component
interface PieChartProps {
    data: any[];
    category: string;
    index: string;
    colors?: string[];
    valueFormatter?: (value: number) => string;
    showLabel?: boolean;
    showTooltip?: boolean;
    showLegend?: boolean;
    className?: string;
}

function PieChart({
    data,
    category,
    index,
    colors = ["blue", "emerald", "indigo", "rose", "amber", "sky"],
    valueFormatter = (value: number) => value.toString(),
    showLabel = false,
    showTooltip = true,
    showLegend = true,
    className,
}: PieChartProps) {
    // Create config for all pie segments
    const config: ChartConfig = {};
    data.forEach((item, i) => {
        const colorName = colors[i % colors.length];
        const colorValue = colorMap[colorName as keyof typeof colorMap];

        if (colorValue) {
            config[item[index]] = {
                label: item[index],
                theme: {
                    light: colorValue.light,
                    dark: colorValue.dark,
                },
            };
        }
    });

    return (
        <ChartContainer className={className} config={config}>
            <RechartsPrimitive.PieChart
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
                <RechartsPrimitive.Pie
                    data={data}
                    dataKey={category}
                    nameKey={index}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    innerRadius="40%"
                    paddingAngle={2}
                    strokeWidth={2}
                >
                    {data.map((entry, i) => (
                        <RechartsPrimitive.Cell
                            key={`cell-${i}`}
                            fill={`var(--color-${entry[index]})`}
                            stroke="var(--background)"
                        />
                    ))}
                    {showLabel && (
                        <RechartsPrimitive.Label
                            position="center"
                            content={({ viewBox }) => {
                                const { cx, cy } = viewBox as {
                                    cx: number;
                                    cy: number;
                                };
                                return (
                                    <text
                                        x={cx}
                                        y={cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-foreground text-xs font-medium"
                                    >
                                        Total
                                    </text>
                                );
                            }}
                        />
                    )}
                </RechartsPrimitive.Pie>

                {showTooltip && (
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                formatter={(value, name) => [
                                    <span
                                        key="value"
                                        className="text-foreground"
                                    >
                                        {valueFormatter(value as number)}
                                    </span>,
                                    <span key="name" className="capitalize">
                                        {name}
                                    </span>,
                                ]}
                            />
                        }
                    />
                )}

                {showLegend && (
                    <ChartLegend
                        content={<ChartLegendContent />}
                        wrapperStyle={{ paddingTop: "8px" }}
                        verticalAlign="bottom"
                        align="center"
                    />
                )}
            </RechartsPrimitive.PieChart>
        </ChartContainer>
    );
}

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
    LineChart,
    PieChart,
};
