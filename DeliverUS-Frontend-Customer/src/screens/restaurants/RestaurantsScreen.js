/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, View } from 'react-native'

import { getAllRestaurants } from '../../api/RestaurantEndpoints'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import ImageCard from '../../components/ImageCard'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import { get3MorePopularProducts } from '../../api/ProductEndpoints'
import defaultProductImage from '../../../assets/product.jpeg'
import ImageCardPopular from '../../components/ImageCardPopular'

export default function RestaurantsScreen ({ navigation, route }) {
  const [restaurants, setRestaurants] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const fetchedRestaurants = await getAllRestaurants()
        setRestaurants(fetchedRestaurants)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurants. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    const fetchedPopularProducts = async () => {
      try {
        const fetchedProducts = await get3MorePopularProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving products. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurants()
    fetchedPopularProducts()
  }, [route])

  const renderRestaurant = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.logo ? { uri: process.env.API_BASE_URL + '/' + item.logo } : restaurantLogo}
        title={item.name}
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.id })
        }}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        {item.averageServiceMinutes !== null &&
          <TextSemiBold>Avg. service time: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.averageServiceMinutes} min.</TextSemiBold></TextSemiBold>
        }
        <TextSemiBold>Shipping: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>{item.shippingCosts.toFixed(2)}€</TextSemiBold></TextSemiBold>
      </ImageCard>
    )
  }

  const renderEmptyRestaurantsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No restaurants were retreived. Are you logged in?
      </TextRegular>
    )
  }

  const renderPopularProducts = ({ item }) => {
    return (
      <ImageCardPopular
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: item.restaurantId })
        }}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        {!item.availability &&
          <TextRegular textStyle={styles.availability }>Not available</TextRegular>
        }
      </ImageCardPopular>
    )
  }

  const renderHeader = ({ item }) => {
    return (<>
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: '1%' }}>
    <TextSemiBold textStyle={styles.section_title}>
      POPULAR PRODUCTS</TextSemiBold>
    </View>
      <FlatList
        horizontal= {true}
        contentContainerStyle={[styles.containerinicio]}
        data={products}
        renderItem={renderPopularProducts}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyRestaurantsList}
      />
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: '1%' }}>
        <View style={styles.lineStyle} >
        </View>
    </View>
    </>
    )
  }

  return (
    <>
    <FlatList
      ListHeaderComponent = {renderHeader}
      style={styles.container}
      data={restaurants}
      renderItem={renderRestaurant}
      keyExtractor={item => item.id.toString()}
      ListEmptyComponent={renderEmptyRestaurantsList}
      />
    </>
  )
}

const styles = StyleSheet.create({
  lineStyle: {
    borderWidth: 0.5,
    borderColor: GlobalStyles.brandPrimary,
    margin: 10,
    width: '90%'
  },
  container: {
    flex: 1
  },
  containerinicio: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start'
  },
  section_title: {
    fontSize: 20,
    color: GlobalStyles.brandPrimary,
    margin: 10
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
