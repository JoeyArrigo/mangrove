import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Animated, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  animation?: Animated.Value;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

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
        },
      ]);
      setNewTodo('');
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
      colors={["#F5F7FA", "#E3E6ED"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ThemedText type="title" style={styles.title}>Todo List</ThemedText>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  color: textColor,
                  borderColor: 'transparent',
                  backgroundColor: '#fff',
                  shadowColor: '#6366F1',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                },
              ]}
              value={newTodo}
              onChangeText={setNewTodo}
              placeholder="Add a new task..."
              placeholderTextColor="#A0AEC0"
              onSubmitEditing={addTodo}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addTodo}
              activeOpacity={0.8}
            >
              <Animated.View style={styles.addButtonInner}>
                <Ionicons name="add" size={28} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.todoList}>
            {todos.map((todo) => (
              <Animated.View
                key={todo.id}
                style={[
                  styles.todoItem,
                  {
                    backgroundColor: '#fff',
                    borderColor: 'transparent',
                    opacity: todo.animation || 1,
                    transform: [
                      {
                        translateY: (todo.animation || new Animated.Value(1)).interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0],
                        }),
                      },
                    ],
                    shadowColor: '#6366F1',
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.todoContent}
                  onPress={() => toggleTodo(todo.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={26}
                    color={todo.completed ? '#6366F1' : iconColor}
                  />
                  <ThemedText
                    style={[
                      styles.todoText,
                      todo.completed && styles.completedTodo,
                      { color: todo.completed ? '#A0AEC0' : textColor },
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
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 28,
    textAlign: 'center',
    color: '#22223B',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    height: 52,
    borderWidth: 0,
    borderRadius: 26,
    paddingHorizontal: 20,
    marginRight: 12,
    fontSize: 17,
    backgroundColor: '#fff',
  },
  addButton: {
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#6366F1',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addButtonInner: {
    backgroundColor: '#6366F1',
    borderRadius: 26,
    width: 52,
    height: 52,
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
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 0,
    backgroundColor: '#fff',
  },
  todoText: {
    marginLeft: 14,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
    fontWeight: '400',
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
