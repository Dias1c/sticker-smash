import { useMemo } from "react"
import { Image, StyleSheet } from "react-native"

export default function ImageViewer({ sourcePlaceholderImage, selectedImageURI }) {
  const imageSource = useMemo(() => {
    if (selectedImageURI != null) {
      return { uri: selectedImageURI }
    }
    return sourcePlaceholderImage
  }, [sourcePlaceholderImage, selectedImageURI])

  return (
    <Image source={imageSource} style={styles.image} />
  )
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  }
})