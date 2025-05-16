import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
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
const FF_DARK_BLUE = '#001b36';
const FF_DARKER_BLUE = '#000a18';
const FF_GOLD = '#ffd700';
const FF_TEXT_BLUE = '#8cccff';
const FF_BORDER = '#4a9fd8';

// Screen dimensions
const { width } = Dimensions.get('window');

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  animation?: Animated.Value;
  appearAnim?: Animated.Value;
  shakeAnim?: Animated.ValueXY;
}

// Base64 encoded pixel art assets
const PIXEL_BORDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAtSURBVHjaYmRgYPjPgAVwcXE9x5D4//8/nM/ExITTACYGPGDUACprwBsLAAD//wMA+/ULdv3h9xAAAAAASUVORK5CYII=';

const CURSOR_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAApklEQVR4nGNgGFTgPxr+jMZnYGBgYGFgYPiPxP6Pxv+MbAiyRnQNn7FpwKYZ2QBkzeiaYS7C6gVkzTA+AwMDw2dsGtANgYmRNcM0I2tGdxHMAHRD0DXDNMNchKwB5g10zTD/wxISSgDdEJhmZM3oBsTrBSYGBgYGRjQBZM3YNKMYANOMzYA4qPgzumZkzdikYfzP2AzBphkmi24AzBB0zdgMGXgAAKNmTaD1sFhAAAAAAElFTkSuQmCC';

const COMPLETION_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAsklEQVR4nO2UMQrCQBBFX2Fhb+MNbL2BjWfwHoKVpZ2VVxDsvIaFlxAsLGwECxu1MPKFhKCym91JY+EPU8z8/8nAkIEYS64gVNGc5ApUMMQkV/ANHI3nwvfd2Sh1ggPQBTrAAegZJYIoJnkSVH3ByUSs+3G+AAEJnRSxf4Gm5rZRIk0DTjVwBrYxcLY1cAG2MXAOwWrm9t/0PILd9+n5Kxro6rZxb3KrDJyLhnOrkQz58wZ36CWtkYE3JAAAAABJRU5ErkJggg==';

const FF_CORNER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFIGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA0LTA0VDEzOjM5OjM4KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNC0wNFQxMzo0MTo0MyswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNC0wNFQxMzo0MTo0MyswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMjNjMzI4YS1iNzFmLTBlNDYtODJjMi01MzExYWIxMjRkN2MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTIzYzMyOGEtYjcxZi0wZTQ2LTgyYzItNTMxMWFiMTI0ZDdjIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MTIzYzMyOGEtYjcxZi0wZTQ2LTgyYzItNTMxMWFiMTI0ZDdjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMjNjMzI4YS1iNzFmLTBlNDYtODJjMi01MzExYWIxMjRkN2MiIHN0RXZ0OndoZW49IjIwMjMtMDQtMDRUMTM6Mzk6MzgrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4DXpIGAAABv0lEQVRYw+3WvUvDQBQH8OTumiBJByHg4uJg/4FOOrj0H3ByLXRxKRQcCuLgVHRycnLyD7h0EHF0cZIuRVCcBHFJBlPEqK95fi+5vF5TmyjUwQsH6b17n1/eu8tFQgj5l8egGdAAaICRGfCA5xkwMgP20DSNAFkQhjEUAMqAAiAP4inQ9/04gJ8gXwK2bbcB+BDMK0DOAVKpVBOAV+Z5CcgY4DhOGyUAgDFuYIyb/QC3dVmmVuZXdKDrWfQD7GrZKt1faVDz+pDe3WzQcHBMD+l1tnWdxgrwu+lx5JRG9yJ9OivTr+cVury8SQAqAJtIECAcLycHCAAwLx7FihQAeHw4T1aAaG0qr0r1DRoOTpIVEPfwLFYAdB7LuQ6Ad3/pOZQBhHM+mQGw+2XllLp7TXq/vcVkBlzeHJIFwJfHckbN619OdiD8+Ky8UfP6V6xASIVrxAK87mXr9BBdXWzK0Wmls/QcsvFXAOeXD6sYY0vX81j6ARKlMkZJzLlHDLC3s5lTFEVx3ZV7dG3MKULhiXHAfwOcbP6/BxgZiQLQO/D5R3ABMHYGQiMMgAzEA0qbMPkjoekrzICRAc0ADWBkBnwDZ3E5w1+UXcgAAAAASUVORK5CYII=';

const HP_BAR_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA1ElEQVR4nO2UMQrCQBBFX2Fha+MN7L2BjWfwHoKVnZ2VVxDEmygWFhIIWKURbKxT5AuGkN1kM9lGfPCr2Zn/3+zOLmiaFnQxb/SJ8/TU/z0cSB/ZiYNLwAYogAOwBmKfgEXTLOI7p6L9NtMJrgA7YMYvsoBFVUBq+yrxWXIgDdSyHii/IVsxkMwQuhGdQqjIjJ6oBqKK4NW1+KDLHGRD5fKhvbKkiUXIoSuJLdVrKnW2Q/UE55HLJUiO9XQp3eCnC1vKITfJ1NeUvBd8A9IAlTIAKuAFsJiLCAzEeGUAAAAASUVORK5CYII=';

const MP_BAR_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAvklEQVR4nO2UwQnCQBBFX8DGbMEWUoIdpAMLsISAla5bgi1oB0k6SAl2IFiCINiBsvADIWR3MpmAB/fAXGZ2/s7s7C5SSvmjLnpHL/Se3k+/sAXpInvhcBfwCeRACWyBsUvAOu/zOj7j8wUYVR9tCN4AO2DC/8rkXC7QlH11vMXnQgvUCj1QNiHbkCKMVIOrSvUiK9IYIKqJnxqLT+oyGzlQQbm8769d0sGC5NDJ1W3YHx3b2Yw9wTnkc2kSOj9G9FS/+9kCzpSEVJsAAAAASUVORK5CYII=';

const XP_BAR_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyklEQVR4nO2UvwrCMBSHPwdHdRUfw8XNF3DzGXwPwcnZycmnEMSncHBwEAShq0Vw0C7lBiGkaW5uWvGHHwTuSb6c5JwLiqL8UxuzpVf6SK+bO2xB2shWODwELIAKqIEdMHMJOC+KrI7P+ewChhfQhuA9sAdm/K5UzuUCbdU3J9/ic6EF6oQBULUhuxAQxmoOPFSqF77IRgBRTfzUWHxRl9nIgRrK5VN/7ZIWFiSHTt7dgf3Rs53d2BOcQz6XIqHzY5CWagmdGZfLRboiLuVKAAAAAElFTkSuQmCC';

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  // const [sound, setSound] = useState();
  const [xpLevel, setXpLevel] = useState(1);
  const [xpProgress, setXpProgress] = useState(0);

  // Animation references
  const titlePulse = useRef(new Animated.Value(1)).current;
  const menuGlow = useRef(new Animated.Value(0)).current;
  const cursorAnim = useRef(new Animated.Value(0)).current;
  const backgroundScroll = useRef(new Animated.Value(0)).current;
  const floatingText = useRef(new Animated.Value(-20)).current;
  const xpBarAnim = useRef(new Animated.Value(0)).current;
  /*
    // Play FF7 style sound effect
    const playSound = async (type): => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          type === 'confirm'
            ? require('@/assets/sounds/ff7_confirm.mp3')
            : type === 'complete'
            ? require('@/assets/sounds/ff7_levelup.mp3')
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
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(titlePulse, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Menu glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(menuGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(menuGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Cursor blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(cursorAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Background subtle scroll animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundScroll, {
          toValue: 50,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundScroll, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating text animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingText, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingText, {
          toValue: -20,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Initialize XP bar animation
    Animated.timing(xpBarAnim, {
      toValue: xpProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update XP bar when progress changes
  useEffect(() => {
    Animated.timing(xpBarAnim, {
      toValue: xpProgress,
      duration: 800,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xpProgress]);

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        appearAnim: new Animated.Value(0),
        shakeAnim: new Animated.ValueXY({ x: 0, y: 0 })
      };

      setTodos([...todos, newTodoItem]);
      setNewTodoText('');

      // Play confirm sound
      // playSound('confirm');

      // Update XP progress
      const newProgress = Math.min(xpProgress + 0.1, 1);
      setXpProgress(newProgress);

      if (newProgress >= 1) {
        // Level up
        setXpLevel(prev => prev + 1);
        setXpProgress(0);
        // Play level up sound
        // playSound('complete');

        // Add a level up flash effect here
        // ...
      }

      // Animate the new todo appearing
      Animated.sequence([
        // Slide in from right
        Animated.timing(newTodoItem.appearAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Small bounce effect
        Animated.spring(newTodoItem.shakeAnim, {
          toValue: { x: 1, y: 0 },
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Reset shake animation
        Animated.timing(newTodoItem.shakeAnim, {
          toValue: { x: 0, y: 0 },
          duration: 100,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const toggleTodo = (id: Todo['id']) => {
    //playSound('cursor');

    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          const animation = new Animated.Value(1);
          const shakeAnimation = new Animated.ValueXY({ x: 0, y: 0 });

          // Update XP progress on completion
          const newProgress = Math.min(xpProgress + 0.25, 1);
          setXpProgress(newProgress);

          if (newProgress >= 1) {
            // Level up
            setXpLevel(prev => prev + 1);
            setXpProgress(0);
            // Play level up sound
            // playSound('complete');
          } else {
            // playSound('confirm');
          }

          Animated.sequence([
            // First shake the item like FF7 battle selection
            Animated.parallel([
              Animated.sequence([
                Animated.timing(shakeAnimation, {
                  toValue: { x: -3, y: 0 },
                  duration: 40,
                  useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                  toValue: { x: 3, y: 0 },
                  duration: 40,
                  useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                  toValue: { x: -3, y: 0 },
                  duration: 40,
                  useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                  toValue: { x: 3, y: 0 },
                  duration: 40,
                  useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                  toValue: { x: 0, y: 0 },
                  duration: 40,
                  useNativeDriver: true,
                }),
              ]),
              Animated.timing(animation, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
            // Flash effect
            Animated.sequence([
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

          return {
            ...todo,
            completed: true,
            animation,
            shakeAnim: shakeAnimation
          };
        }
        return todo;
      })
    );
  };

  // FF7-style cursor component
  const Cursor = ({ visible }: { visible: boolean }) => (
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
        source={{ uri: CURSOR_IMG }}
        style={{ width: 20, height: 20 }}
      />
    </Animated.View>
  );

  // FF7-style menu header with HP/MP bars
  const StatusBars = () => (
    <View style={styles.statusBars}>
      <View style={styles.statusBar}>
        <Image source={{ uri: HP_BAR_ICON }} style={styles.statusIcon} />
        <View style={styles.barContainer}>
          <View style={[styles.barFill, { width: `${100 * (1 - (todos.length * 0.1))}%`, backgroundColor: '#1aff1a' }]} />
        </View>
        <ThemedText style={styles.statusText}>{`${Math.max(100 - todos.length * 10, 0)}/100`}</ThemedText>
      </View>

      <View style={styles.statusBar}>
        <Image source={{ uri: MP_BAR_ICON }} style={styles.statusIcon} />
        <View style={styles.barContainer}>
          <View style={[styles.barFill, { width: '70%', backgroundColor: '#66b3ff' }]} />
        </View>
        <ThemedText style={styles.statusText}>70/100</ThemedText>
      </View>

      <View style={styles.statusBar}>
        <Image source={{ uri: XP_BAR_ICON }} style={styles.statusIcon} />
        <View style={styles.barContainer}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: xpBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }),
                backgroundColor: '#ffcc00'
              }
            ]}
          />
        </View>
        <ThemedText style={styles.statusText}>{`Lv.${xpLevel}`}</ThemedText>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[FF_DARK_BLUE, '#000000']}
      style={styles.container}
    >
      <Animated.Image
        source={{ uri: PIXEL_BORDER }}
        style={[
          styles.backgroundPattern,
          {
            transform: [
              { translateY: backgroundScroll }
            ],
            opacity: 0.03
          }
        ]}
        resizeMode="repeat"
      />

      <SafeAreaView style={styles.safe}>
        <Image
          source={{ uri: FF_CORNER_ICON }}
          style={styles.cornerIcon}
        />

        <StatusBars />

        {/* FF7-style title with pulse animation */}
        <Animated.View style={{
          alignItems: 'center',
          marginBottom: 24,
          transform: [{ scale: titlePulse }]
        }}>
          <LinearGradient
            colors={[FF_BLUE, FF_LIGHT_BLUE, FF_BLUE]}
            style={styles.titleContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image
              source={{ uri: PIXEL_BORDER }}
              style={styles.borderPattern}
            />
            <ThemedText style={styles.title}>QUEST LOG</ThemedText>

            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: menuGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5]
                  })
                }
              ]}
            />
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
          ]}>
          <View style={styles.inputRow}>
            <Cursor visible={true} />
            <TextInput
              style={styles.input}
              placeholder="Enter new quest..."
              placeholderTextColor={FF_TEXT_BLUE}
              value={newTodoText}
              onChangeText={setNewTodoText}
              onSubmitEditing={addTodo}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addTodo}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[FF_LIGHT_BLUE, FF_BLUE, FF_DARK_BLUE]}
                style={styles.buttonGradient}
              >
                <Image
                  source={{ uri: PIXEL_BORDER }}
                  style={styles.buttonBorder}
                />
                <ThemedText style={styles.buttonText}>ADD</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Todo List */}
        <View style={styles.todoListContainer}>
          {todos.map((todo) => {
            // Skip rendering if the todo is flagged as completed
            if (todo.completed && (!todo.animation)) {
              return null;
            }

            // Appearance animation for new todos
            const appearTransform = todo.appearAnim
              ? {
                opacity: todo.appearAnim,
                transform: [
                  {
                    translateX: todo.appearAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  // Add shake animation from the shake value
                  {
                    translateX: todo.shakeAnim?.x || 0,
                  },
                ],
              }
              : {};

            // Animation for completed todos
            const completeStyle = todo.animation
              ? {
                opacity: todo.animation,
                transform: [
                  {
                    scale: todo.animation,
                  },
                  {
                    translateX: todo.shakeAnim?.x || 0,
                  },
                ],
              }
              : {};

            return (
              <Animated.View
                key={todo.id}
                style={[
                  styles.todoContainer,
                  appearTransform,
                  completeStyle,
                ]}
              >
                <LinearGradient
                  colors={[FF_DARKER_BLUE, FF_DARK_BLUE, FF_DARKER_BLUE]}
                  style={styles.todoGradient}
                >
                  <Image
                    source={{ uri: PIXEL_BORDER }}
                    style={styles.todoBorder}
                  />
                  <TouchableOpacity
                    style={styles.todoTouchable}
                    onPress={() => toggleTodo(todo.id)}
                  >
                    <View style={styles.todoRow}>
                      <Cursor visible={false} />
                      <ThemedText style={styles.todoText}>
                        {todo.text}
                      </ThemedText>
                      {todo.completed && (
                        <Animated.Image
                          source={{ uri: COMPLETION_ICON }}
                          style={{
                            width: 24,
                            height: 24,
                            marginLeft: 8,
                            opacity: todo.animation,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            );
          })}

          {todos.length === 0 && (
            <Animated.View
              style={[
                styles.emptyStateContainer,
                {
                  transform: [
                    { translateY: floatingText }
                  ]
                }
              ]}
            >
              <Image
                source={{ uri: CURSOR_IMG }}
                style={styles.emptyStateCursor}
              />
              <ThemedText style={styles.emptyStateText}>Your quest log is empty</ThemedText>
            </Animated.View>
          )}
        </View>

        {/* Level Up Notification */}
        {xpProgress === 0 && xpLevel > 1 && (
          <Animated.View
            style={[
              styles.levelUpContainer,
              {
                opacity: floatingText.interpolate({
                  inputRange: [-20, -10],
                  outputRange: [0.7, 1]
                })
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,215,0,0.9)', 'rgba(255,215,0,0.7)', 'rgba(255,215,0,0.5)']}
              style={styles.levelUpGradient}
            >
              <ThemedText style={styles.levelUpText}>
                LEVEL UP! {xpLevel - 1} → {xpLevel}
              </ThemedText>
            </LinearGradient>
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  safe: {
    flex: 1,
    padding: 16,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '400%',
    height: '400%',
  },
  cornerIcon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 45 : 15,
    right: 15,
    width: 36,
    height: 36,
    opacity: 0.8,
  },
  statusBars: {
    marginTop: Platform.OS === 'ios' ? 10 : 30,
    marginBottom: 20,
    width: '100%',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: FF_BORDER,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 1,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  titleContainer: {
    position: 'relative',
    width: width * 0.9,
    padding: 16,
    borderWidth: 2,
    borderColor: FF_BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  borderPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  title: {
    paddingVertical: 4,
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 2,
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: '120%',
    height: '120%',
    backgroundColor: FF_GOLD,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: FF_DARKER_BLUE,
    borderWidth: 2,
    borderColor: FF_BORDER,
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    height: 40,
    padding: 8,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: FF_BORDER,
    borderRadius: 2,
  },
  addButton: {
    marginLeft: 12,
    height: 40,
    width: 80,
    borderRadius: 4,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  buttonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  todoListContainer: {
    flex: 1,
    marginTop: 8,
  },
  todoContainer: {
    marginBottom: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  todoGradient: {
    position: 'relative',
    borderWidth: 1,
    borderColor: FF_BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  todoBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  todoTouchable: {
    padding: 16,
    paddingLeft: 12,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoText: {
    marginLeft: 8,
    fontSize: 16,
    color: FF_TEXT_BLUE,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  emptyStateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 20,
  },
  emptyStateCursor: {
    width: 20,
    height: 20,
    opacity: 0.7,
    marginRight: 8,
  },
  emptyStateText: {
    color: FF_TEXT_BLUE,
    opacity: 0.7,
    fontSize: 16,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  levelUpContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelUpGradient: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  levelUpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: FF_DARK_BLUE,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  }
});
