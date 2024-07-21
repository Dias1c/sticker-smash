import domtoimage from 'dom-to-image';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import Button from './components/Button';
import CircleButton from './components/CircleButton';
import EmojiList from './components/EmojiList';
import EmojiPicker from './components/EmojiPicker';
import EmojiSticker from './components/EmojiSticker';
import IconButton from './components/IconButton';
import ImageViewer from './components/ImageViewer';

const PlaceholderImage = require('./assets/images/background-image.png')

// 1. Почему image использует source вместо src?
// Как я понял, source это object в котором есть uri. 

// Заключение, за сегодня (2024-07-18)
// За сегодня, создал приложение используя React Native. 
// В первые запустил на веб
// Проходя по курсу, узнал о таких компонентах как:
// View, Text, Pressable, Image
// Создал свои компоннеты
// Установил и использовал внешний пакет, expo-image-что то там.
// Узнал о StyleSheet и создал стили
// Узнал что в каждом компоннете свойство style в который можно передать массив, стилей, и они наслаиваются.
// Создавал приложение по туториалу, пока не закончил, но дошел до этого этапа: https://docs.expo.dev/tutorial/create-a-modal/

// В принципе, получил удовольстве от процесса. Отвлекся от всего, и сконцентрированно что то делал, редко приятное чувство. А еще все получалось.

// (2024-07-21)
// Компонент Modal, FlatList
// Первая модалка
// Интерактивный список emoji, отображение и выбор
// Теперь можно выбрать emoji 
// Внешняя библиотека для (Gestures) жестов (Tap, Drag/Pan)
// Анимации которые вызываются при изменении или вызове жестов
// Внешняя библиотека для сохранения фотографий (Которая работает только в Android, IOS)
// Внешняя библиотека для сохранения фотографий из DOM (для WEB)
// Обьект Platform которая сожержит платформу на которой ранится проект, удобно для реализации разных фич
// Настройка статус бара в приложении (Верхний баг где показывается время, иконки уведомления android)
// Настройка иконки приложения, и страницы первичной загрузки.
// Завершил introduction работы с ReactNative и Expo
// Перешел и остановился на странице: https://docs.expo.dev/tutorial/follow-up/


export default function App() {
  const imageRef = useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const [selectedImage, setSelectedImage] = useState()
  const [showAppOptions, setShowAppOptions] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pickedEmoji, setPickedEmoji] = useState(null);

  if (status === null) {
    requestPermission()
  }

  const pickImageAsync = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })
  
    if (result.canceled) {
      alert('result canseled')
      return
    } 
    setShowAppOptions(true)
    setSelectedImage(result.assets[0].uri)
  }, [])

  const onReset = () => {
    setShowAppOptions(false)
  }

  const onAddSticker = () =>{
    setIsModalVisible(true)
  }


  const onSaveImageAsync = async () =>{
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        })

        await MediaLibrary.saveToLibraryAsync(localUri)
        if (localUri) alert("Saved!");
      } catch (e) {
        alert(e)
      }
    } else {
      try {
        const localUri = await domtoimage.toJpeg(imageRef.current, {
          quality: 1,
          width: 320,
          height: 440,
        })

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = localUri;
        link.click();
        link.remove()
      } catch (error) {
        alert(error)
      }
    }
  }

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <View > */}
        <View style={styles.imageCountainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer sourcePlaceholderImage={PlaceholderImage} selectedImageURI={selectedImage} />
            {pickedEmoji && <EmojiSticker imageSize={40} sourceSticker={pickedEmoji} />}
          </View>
        </View>
        {showAppOptions ? 
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon={"refresh"} label={"Reset"} onPress={onReset}/>
            <CircleButton onPress={onAddSticker}/>
            <IconButton icon={"save-alt"} label={"Save"} onPress={onSaveImageAsync}/>
          </View>
        </View>
        : 
        <View style={styles.optionsContainer}>
          <Button label={"Choose a photo"} theme={'primary'} onPress={pickImageAsync} />
          <Button label={"Use this photo"} onPress={() => setShowAppOptions(true)}/>
        </View>
        }
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
        </EmojiPicker>
        <StatusBar style="light" />
      {/* </View> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageCountainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  optionsContainer: {
    paddingBottom: 80,
  }
});
