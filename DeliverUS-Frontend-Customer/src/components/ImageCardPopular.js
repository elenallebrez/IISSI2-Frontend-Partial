import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import TextSemiBold from './TextSemibold'
import * as GlobalStyles from '../styles/GlobalStyles'

// Props: defaultImageUri: {uri: xxx}, imageUri: {uri: xxx}, onPress: () => {}, title: String, badgeText: String, touchable: boolean
// Style props: cardStyle, imageContainerStyle, imageStyle, bodyStyle, titleStyle
export default function ImageCardPopular (props) {
  const renderImageCardBodyPopular = (props) => {
    return (
      <View style={styles.card} >
        <View>
          <Image style={styles.image} source={props.imageUri} />
        </View>
        <View style={styles.cardBody}>
            <TextSemiBold textStyle={styles.cardTitle}>{props.title}</TextSemiBold>
            {props.children}
        </View>
      </View>
    )
  }

  return (
    props.onPress
      ? <Pressable onPress={props.onPress} style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? GlobalStyles.brandPrimaryTap
            : GlobalStyles.brandBackground
        },
        styles.wrapperCustom
      ]}>
          {renderImageCardBodyPopular(props)}
        </Pressable>
      : <>
          {renderImageCardBodyPopular(props)}
        </>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    height: 127,
    padding: 2,
    width: 440,
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15
  },
  image: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    height: 123,
    width: 123
  },
  cardBody: {
    marginRight: 10,
    marginLeft: 10,
    paddingVertical: 5,
    flex: 4,
    position: 'relative',
    height: 123
  },
  cardTitle: {
    fontSize: 15
  }
})
