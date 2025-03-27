/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import { getOrderDetail } from '../../api/OrderEndpoints.js'

export default function OrderDetailScreen ({ navigation, route }) {
  const [order, setOrder] = useState({})

  useEffect(() => {
    async function fetchOrderDetail () {
      try {
        const fetchedOrder = await getOrderDetail(route.params.id)
        setOrder(fetchedOrder)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving order details (id ${route.params.id}). ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }fetchOrderDetail()
  }, [route])

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <ImageBackground source={(order.restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + order.restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.logoContainer}>
          <TextSemiBold textStyle={styles.restaurantNameStyle}>
              {order.restaurant?.name ? order.restaurant.name : 'Restaurante Name'}
            </TextSemiBold>
            <Image
              style={styles.logoStyle}
              source={order.restaurant?.logo ? { uri: `${process.env.API_BASE_URL}/${order.restaurant.logo}`, cache: 'force-cache' } : undefined}
            />
            <TextRegular textStyle={{ color: 'white' }}>Status: <TextSemiBold textStyle={order.status === 'in process' ? { color: GlobalStyles.brandSecondary } : order.status === 'sent' ? { color: GlobalStyles.brandGreen } : order.status === 'delivered' ? { color: 'blue' } : { color: GlobalStyles.brandPrimary }}>{order.status}</TextSemiBold></TextRegular>
            <TextRegular textStyle={{ color: 'white' }}>Price: <TextSemiBold>{order.price}€</TextSemiBold></TextRegular>
            <TextRegular textStyle={{ color: 'white' }}>Shipping Costs: <TextSemiBold>{order.shippingCosts}€</TextSemiBold></TextRegular>
            <TextRegular textStyle={{ color: 'white' }}>Address: <TextRegular>{order.address}</TextRegular></TextRegular>
            <TextRegular textStyle={{ color: 'white' }}>Date: <TextRegular>{order.createdAt}</TextRegular></TextRegular>
          </View>
        </ImageBackground>
      </View>
    )
  }

  const renderProduct = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
      >
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        <TextRegular>Quantity: <TextSemiBold textStyle={styles.price}>{item.OrderProducts.quantity}</TextSemiBold></TextRegular>
      </ImageCard>
    )
  }

  const renderEmptyProductsList = () => {
    return (
      <TextRegular>
        This order has no products.
      </TextRegular>
    )
  }

  return (
    <View style={styles.container}>
    <FlatList
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyProductsList}
      style={styles.container}
      data={order.products}
      renderItem={renderProduct}
      keyExtractor={item => item.id.toString()}
    />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    width: '100%'
  },
  logoContainer: {
    height: 300,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logoStyle: {
    height: 100,
    width: 100,
    margin: 10
  },
  textContainer: {
    padding: 20
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  restaurantNameStyle: {
    fontSize: 20,
    color: 'white'
  },
  description: {
    fontSize: 16,
    marginTop: 10
  }
})
