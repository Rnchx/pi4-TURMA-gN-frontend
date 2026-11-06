import { useState } from "react";
import { Pressable } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
import { motion, touch } from "../../theme";

// Resposta ao toque no press-in (escala 0,97 em 120 ms, transição CSS do Reanimated na thread de UI).
// Com redução de movimento, a escala dá lugar a uma leve mudança de opacidade.
export default function PressableScale({
  children, style, containerStyle, scaleTo = 0.97, onPressIn, onPressOut, hitSlop = touch.hitSlop, ...props
}) {
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();
  const active = pressed && !props.disabled;
  return (
    <Pressable
      {...props}
      hitSlop={hitSlop}
      pressRetentionOffset={{ top: 12, bottom: 12, left: 12, right: 12 }}
      onPressIn={(event) => { setPressed(true); onPressIn?.(event); }}
      onPressOut={(event) => { setPressed(false); onPressOut?.(event); }}
      style={containerStyle}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: active && !reduced ? scaleTo : 1 }],
            opacity: active && reduced ? 0.8 : 1,
            transitionProperty: ["transform", "opacity"],
            transitionDuration: motion.press,
            transitionTimingFunction: "ease-out",
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
