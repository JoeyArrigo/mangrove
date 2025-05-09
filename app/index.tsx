import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
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
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safe}>
            <ThemedText type="title" style={styles.title}>Todo List</ThemedText>

            <ThemedView style={styles.inputContainer}>
                <TextInput
                style={[
                    styles.input,
                    {
                    color: textColor,
                    borderColor: iconColor,
                    backgroundColor: backgroundColor,
                    },
                ]}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="Add a new task..."
                placeholderTextColor={iconColor}
                onSubmitEditing={addTodo}
                />
                <TouchableOpacity style={styles.addButton} onPress={addTodo}>
                <Ionicons name="add-circle" size={24} color={tintColor} />
                </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.todoList}>
                {todos.map((todo) => (
                <TouchableOpacity
                    key={todo.id}
                    style={[
                    styles.todoItem,
                    {
                        backgroundColor: backgroundColor,
                        borderColor: iconColor,
                    },
                    ]}
                    onPress={() => toggleTodo(todo.id)}
                >
                    <Ionicons
                    name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={todo.completed ? '#4CAF50' : iconColor}
                    />
                    <ThemedText
                    style={[
                        styles.todoText,
                        todo.completed && styles.completedTodo,
                        { color: todo.completed ? iconColor : textColor },
                    ]}
                    >
                    {todo.text}
                    </ThemedText>
                </TouchableOpacity>
                ))}
            </ThemedView>
        </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    padding: 10,
  },
  todoList: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
  },
  safe: {
    flex: 1,
  },
});
