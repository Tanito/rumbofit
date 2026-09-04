import { Children, type ComponentProps, type PropsWithChildren } from "react";
import { View } from "react-native";

type CleanViewProps = PropsWithChildren<ComponentProps<typeof View>>;

/** React Native Web warns about whitespace-only JSX nodes under View. */
export function CleanView({ children, ...props }: CleanViewProps) {
  const filteredChildren = Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim().length > 0,
  );

  return <View {...props}>{filteredChildren}</View>;
}
