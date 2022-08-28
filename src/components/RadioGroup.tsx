import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface RadioGroupProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; text: string }[];
}

export const RadioGroup = <T,>({
  value: selectedValue,
  onChange: setSelectedValue,
  options,
}: RadioGroupProps<T>) => {
  return (
    <View>
      {options.map(({ text, value }, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            value === selectedValue && styles.optionActive,
          ]}
          onPress={() => {
            setSelectedValue(value);
          }}
        >
          <Text
            style={[
              styles.optionText,
              value === selectedValue && styles.optionTextActive,
            ]}
          >
            {text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    marginVertical: 12,
    padding: 16,
    borderRadius: 36,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  optionActive: {
    backgroundColor: "#9ca3af",
  },

  optionText: {
    color: "black",
    textAlign: "center",
  },
  optionTextActive: {
    color: "white",
  },
});
