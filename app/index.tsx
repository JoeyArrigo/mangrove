import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  animation?: Animated.Value;
  color?: string;
  emoji?: string;
}

const FUN_COLORS = [
  '#FFB6C1', // Light Pink
  '#FFD700', // Gold
  '#87CEFA', // Light Sky Blue
  '#98FB98', // Pale Green
  '#FFA07A', // Light Salmon
  '#FF69B4', // Hot Pink
  '#FFDAB9', // Peach Puff
  '#E0BBE4', // Lavender
  '#FEE440', // Bright Yellow
  '#00F2F8', // Aqua
];
const TODO_EMOJIS = ['🦄', '🌈', '🍭', '🎉', '✨', '🍕', '🍦', '🎈', '😺', '🚀'];

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));
  const inputRef = useRef<TextInput>(null);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo.trim(),
          completed: false,
          color: FUN_COLORS[Math.floor(Math.random() * FUN_COLORS.length)],
          emoji: TODO_EMOJIS[Math.floor(Math.random() * TODO_EMOJIS.length)],
        },
      ]);
      setNewTodo('');
    } else {
      // Shake animation for empty input
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const animation = new Animated.Value(1);
          Animated.timing(animation, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }).start(() => {
            setTodos((currentTodos) => 
              currentTodos.filter((t) => t.id !== id)
            );
          });
          return { ...todo, completed: true, animation };
        }
        return todo;
      })
    );
  };

  return (
    <LinearGradient
      colors={["#FFB6C1", "#FFD700", "#87CEFA", "#98FB98", "#FF69B4"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ThemedText type="title" style={styles.title}>
            Todo List <Text style={{ fontSize: 32 }}>🎈</Text>
          </ThemedText>

          <Animated.View
            style={[
              styles.inputContainer,
              inputFocused && styles.inputContainerFocused,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                inputFocused && styles.inputFocused,
              ]}
              value={newTodo}
              onChangeText={setNewTodo}
              placeholder="Add a fun new task..."
              placeholderTextColor="#A0AEC0"
              onSubmitEditing={addTodo}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addTodo}
              activeOpacity={0.8}
            >
              <Animated.View style={styles.addButtonInner}>
                <Ionicons name="add" size={32} color="#fff" style={{ transform: [{ rotate: inputFocused ? '90deg' : '0deg' }] }} />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <ThemedView style={styles.todoList}>
            {todos.map((todo, idx) => (
              <Animated.View
                key={todo.id}
                style={[
                  styles.todoItem,
                  {
                    backgroundColor: todo.color,
                    shadowColor: todo.color,
                    opacity: todo.animation || 1,
                    transform: [
                      {
                        translateY: (todo.animation || new Animated.Value(1)).interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.todoContent}
                  onPress={() => toggleTodo(todo.id)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 24, marginRight: 6 }}>{todo.emoji}</Text>
                  <Ionicons
                    name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={28}
                    color={todo.completed ? '#fff' : '#22223B'}
                    style={{ textShadowColor: '#fff', textShadowRadius: 4 }}
                  />
                  <ThemedText
                    style={[
                      styles.todoText,
                      todo.completed && styles.completedTodo,
                      { color: todo.completed ? '#fff' : '#22223B', fontWeight: '700' },
                    ]}
                  >
                    {todo.text}
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 28,
    paddingTop: 28,
    textAlign: 'center',
    color: '#22223B',
    letterSpacing: 1,
    fontFamily: 'System',
    textShadowColor: '#fff',
    textShadowRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inputContainerFocused: {
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 0,
    borderRadius: 28,
    paddingHorizontal: 22,
    marginRight: 12,
    fontSize: 18,
    backgroundColor: '#fff',
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: 'System',
  },
  inputFocused: {
    borderColor: '#FFD700',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  addButton: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#FF69B4',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  addButtonInner: {
    backgroundColor: '#FF69B4',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoList: {
    flex: 1,
    marginTop: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 0,
    backgroundColor: '#fff',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  todoText: {
    marginLeft: 14,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    fontFamily: 'System',
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#fff',
    fontWeight: '400',
    opacity: 0.7,
  },
  safe: {
    flex: 1,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
