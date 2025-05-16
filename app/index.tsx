import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Audio } from 'expo-av';
import { ThemedText } from '@/components/ThemedText';

// FF7/FF8-inspired constants
const FF_BLUE = '#0066a6';
const FF_LIGHT_BLUE = '#38b0de';
const FF_DARK_BLUE = '#003366';
const FF_GOLD = '#ffd700';
const FF_TEXT_BLUE = '#8cccff';
const FF_BORDER = '#4a9fd8';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  animation?: Animated.Value;
  appearAnim?: Animated.Value;
}

const generatePixelBorderUri = () => {
  // Base64 encoded small pixel border pattern in FF7 style
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAtSURBVHjaYmRgYPjPgAVwcXE9x5D4//8/nM/ExITTACYGPGDUACprwBsLAAD//wMA+/ULdv3h9xAAAAAASUVORK5CYII=';
};

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  // const [sound, setSound] = useState();

  // Animation references
  const titlePulse = useRef(new Animated.Value(1)).current;
  const menuGlow = useRef(new Animated.Value(0)).current;
  const cursorAnim = useRef(new Animated.Value(0)).current;
/*
  // Play FF7 style sound effect
  const playSound = async (type): => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        type === 'confirm'
          ? require('@/assets/sounds/ff7_confirm.mp3')
          : require('@/assets/sounds/ff7_cursor.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      // Sound failed to load, continue silently
    }
  };

  // Clean up sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);
*/

  // Animations
  useEffect(() => {
    // Title pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(titlePulse, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(titlePulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Menu glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(menuGlow, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(menuGlow, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Cursor blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(cursorAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        appearAnim: new Animated.Value(0)
      };

      setTodos([...todos, newTodoItem]);
      setNewTodoText('');

      // Play confirm sound
      // playSound('confirm');

      // Animate the new todo appearing
      Animated.timing(newTodoItem.appearAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleTodo = (id: Todo['id']) => {
    //playSound('cursor');

    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          const animation = new Animated.Value(1);

          Animated.sequence([
            // First shake the item like FF7 battle selection
            Animated.sequence([
              Animated.timing(animation, {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(animation, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(animation, {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(animation, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]),
            // Then fade out on completion
            Animated.timing(animation, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            })
          ]).start(() => {
            setTodos(currentTodos =>
              currentTodos.filter(t => t.id !== id)
            );
          });

          return { ...todo, completed: true, animation };
        }
        return todo;
      })
    );
  };

  // FF7-style cursor component
  const Cursor = ({ visible }: { visible: boolean}) => (
    <Animated.View
      style={{
        opacity: visible ? cursorAnim : 0,
        transform: [{
          scale: visible ? cursorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1.1]
          }) : 1
        }]
      }}
    >
      <Image
        source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAApklEQVR4nGNgGFTgPxr+jMZnYGBgYGFgYPiPxP6Pxv+MbAiyRnQNn7FpwKYZ2QBkzeiaYS7C6gVkzTA+AwMDw2dsGtANgYmRNcM0I2tGdxHMAHRD0DXDNMNchKwB5g10zTD/wxISSgDdEJhmZM3oBsTrBSYGBgYGRjQBZM3YNKMYANOMzYA4qPgzumZkzdikYfzP2AzBphkmi24AzBB0zdgMGXgAAKNmTaD1sFhAAAAAAElFTkSuQmCC' }}
        style={{ width: 20, height: 20 }}
      />
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[FF_DARK_BLUE, '#000000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <Image
          source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFIGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTA0VDEzOjM5OjM4KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0wNFQxMzo0MTo0MyswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0wNFQxMzo0MTo0MyswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMjNjMzI4YS1iNzFmLTBlNDYtODJjMi01MzExYWIxMjRkN2MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTIzYzMyOGEtYjcxZi0wZTQ2LTgyYzItNTMxMWFiMTI0ZDdjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MTIzYzMyOGEtYjcxZi0wZTQ2LTgyYzItNTMxMWFiMTI0ZDdjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMjNjMzI4YS1iNzFmLTBlNDYtODJjMi01MzExYWIxMjRkN2MiIHN0RXZ0OndoZW49IjIwMjMtMDQtMDRUMTM6Mzk6MzgrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4DXpIGAAABv0lEQVRYw+3WvUvDQBQH8OTumiBJByHg4uJg/4FOOrj0H3ByLXRxKRQcCuLgVHRycnLyD7h0EHF0cZIuRVCcBHFJBlPEqK95fi+5vF5TmyjUwQsH6b17n1/eu8tFQgj5l8egGdAAaICRGfCA5xkwMgP20DSNAFkQhjEUAMqAAiAP4inQ9/04gJ8gXwK2bbcB+BDMK0DOAVKpVBOAV+Z5CcgY4DhOGyUAgDFuYIyb/QC3dVmmVuZXdKDrWfQD7GrZKt1faVDz+pDe3WzQcHBMD+l1tnWdxgrwu+lx5JRG9yJ9OivTr+cVury8SQAqAJtIECAcLycHCAAwLx7FihQAeHw4T1aAaG0qr0r1DRoOTpIVEPfwLFYAdB7LuQ6Ad3/pOZQBhHM+mQGw+2XllLp7TXq/vcVkBlzeHJIFwJfHckbN619OdiD8+Ky8UfP6V6xASIVrxAK87mXr9BBdXWzK0Wmls/QcsvFXAOeXD6sYY0vX81j6ARKlMkZJzLlHDLC3s5lTFEVx3ZV7dG3MKULhiXHAfwOcbP6/BxgZiQLQO/D5R3ABMHYGQiMMgAzEA0qbMPkjoekrzICRAc0ADWBkBnwDZ3E5w1+UXcgAAAAASUVORK5CYII=' }}
          style={styles.cornerIcon}
        />

        {/* FF7-style title with pulse animation */}
        <Animated.View style={{
          alignItems: 'center',
          marginBottom: 24,
          transform: [{ scale: titlePulse }]
        }}>
          <LinearGradient
            colors={[FF_BLUE, FF_LIGHT_BLUE, FF_BLUE]}
            style={styles.titleContainer}
          >
            <Image
              source={{ uri: generatePixelBorderUri() }}
              style={styles.borderPattern}
            />
            <ThemedText style={styles.title}>QUEST LOG</ThemedText>
          </LinearGradient>
        </Animated.View>

        {/* Input Container */}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              shadowColor: FF_GOLD,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: menuGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7]
              }),
              shadowRadius: 8
            }
          ]}
        >
          <LinearGradient
            colors={[FF_DARK_BLUE, FF_BLUE, FF_DARK_BLUE]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inputGradient}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={newTodoText}
                onChangeText={(text) => {
                  setNewTodoText(text);
                  if (text.length === 1 && newTodoText === '') {
                    // playSound('cursor');
                  }
                }}
                placeholder="Enter new quest..."
                placeholderTextColor="#6a9cc5"
                onSubmitEditing={addTodo}
                selectionColor={FF_GOLD}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addTodo}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[FF_GOLD, '#d4af37', FF_GOLD]}
                  style={styles.buttonGradient}
                >
                  <ThemedText style={styles.buttonText}>ADD</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Todo List */}
        <View style={styles.todoList}>
          {todos.map((todo: Todo) => {
            const scaleAndOpacity = todo.animation || new Animated.Value(1);
            const appearValue = todo.appearAnim || new Animated.Value(1);

            return (
              <Animated.View
                key={todo.id}
                style={[
                  styles.todoItem,
                  {
                    opacity: scaleAndOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    transform: [
                      { scale: scaleAndOpacity },
                      {
                        translateY: appearValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      }
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={[FF_DARK_BLUE, '#102a45', FF_DARK_BLUE]}
                  style={styles.todoGradient}
                >
                  <TouchableOpacity
                    style={styles.todoContent}
                    onPress={() => toggleTodo(todo.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cursorContainer}>
                      <Cursor visible={!todo.completed} />
                    </View>

                    <View style={styles.todoTextContainer}>
                      <ThemedText
                        style={[
                          styles.todoText,
                          todo.completed && styles.completedTodo,
                        ]}
                      >
                        {todo.text}
                      </ThemedText>

                      {todo.completed && (
                        <View style={styles.completionContainer}>
                          <Image
                            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAsklEQVR4nO2UMQrCQBBFX2Fhb+MNbL2BjWfwHoKVpZ2VVxDsvIaFlxAsLGwECxu1MPKFhKCym91JY+EPU8z8/8nAkIEYS64gVNGc5ApUMMQkV/ANHI3nwvfd2Sh1ggPQBTrAAegZJYIoJnkSVH3ByUSs+3G+AAEJnRSxf4Gm5rZRIk0DTjVwBrYxcLY1cAG2MXAOwWrm9t/0PILd9+n5Kxro6rZxb3KrDJyLhnOrkQz58wZ36CWtkYE3JAAAAABJRU5ErkJggg==' }}
                            style={styles.completionIcon}
                          />
                          <ThemedText style={styles.completionText}>COMPLETED</ThemedText>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  safe: {
    flex: 1,
  },
  cornerIcon: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  titleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 4,
    borderColor: FF_BORDER,
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  borderPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  inputContainer: {
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputGradient: {
    borderWidth: 2,
    borderColor: FF_BORDER,
    borderRadius: 8,
    padding: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'rgba(0, 10, 30, 0.7)',
    color: FF_TEXT_BLUE,
    borderRadius: 4,
    marginRight: 8,
  },
  buttonGradient: {
    borderRadius: 4,
    padding: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  todoList: {
    flex: 1,
  },
  todoItem: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  todoGradient: {
    borderWidth: 2,
    borderColor: FF_BORDER,
    borderRadius: 8,
    overflow: 'hidden',
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cursorContainer: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: FF_TEXT_BLUE,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  completionIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  completionText: {
    fontSize: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  addButton: {
    overflow: 'hidden',
    borderRadius: 4,
  },
});
