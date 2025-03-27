/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable, ScrollView } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { getDetail } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultProductImage from '../../../assets/product.jpeg'
import { brandPrimary } from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup'
import { update, getOrderDetail } from '../../api/OrderEndpoints'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { Formik } from 'formik'
import InputItem from '../../components/InputItem'
import TextError from '../../components/TextError'
import OrderModal from '../../components/OrderModal'
import { getDetailP } from '../../api/ProductEndpoints'
import { buildInitialValues } from '../../../../DeliverUS-Frontend-Owner/src/screens/Helper'

export default function EditOrderScreen ({ navigation, route }) {
  const [initialOrderValues, setInitialOrderValues] = useState({
    address: null,
    products: [{ OrderProducts: { quantity: 0 } }]
  })
  const { loggedInUser } = useContext(AuthorizationContext)
  const [backendErrors, setBackendErrors] = useState()
  const [restaurant, setRestaurant] = useState({})
  const [order, setOrder] = useState({})
  const [productSelection, setProductSelection] = useState(({}))
  const [finalPrice, setFinalPrice] = useState()
  const [shipping, setShipping] = useState()
  const [orderPrice, setOrderPrice] = useState()

  const [confirmador, setConfirmador] = useState(0)

  useEffect(() => {
    async function fetchOrderDetail () {
      try {
        const fetchedOrder = await getOrderDetail(route.params.id)
        setOrder(fetchedOrder)
        updateCounters(fetchedOrder)
        const initialValues = buildInitialValues(fetchedOrder, initialOrderValues)
        setInitialOrderValues(initialValues)
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

  useEffect(() => {
    fetchRestaurantDetail()
  }, [route])

  useEffect(() => {
    const fetchPrice = async () => {
      const final = await createPrice(productSelection)
      setOrderPrice(final)
      if (final < 10) {
        setFinalPrice(final + restaurant.shippingCosts)
        setShipping(restaurant.shippingCosts)
      } else {
        setShipping(0)
        setFinalPrice(final)
      }
    }
    fetchPrice()
  }, [productSelection])
  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: process.env.API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
            <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
            <TextRegular textStyle={styles.description}>{restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}</TextRegular>
          </View>
        </ImageBackground>
{ loggedInUser && (

        <View style={[{ flexDirection: 'row', justifyContent: 'center' }]}>
          <Pressable
          onPress={() => {
            setConfirmador(1)
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandGreenTap
                : GlobalStyles.brandGreen
            },
            styles.actionButton2
          ]}>
         <View
              style={[
                { flex: 1, flexDirection: 'row', justifyContent: 'center' }
              ]}
            >
              <MaterialCommunityIcons name='plus-circle' color={'white'} size={20} />
              <TextRegular textStyle={styles.text}>Update Order</TextRegular>
            </View>
      </Pressable>
        </View>
)
}
      </View>
    )
  }
  const renderProduct = ({ item }) => {
    const addProduct = () => {
      setProductSelection(productSelection => ({
        ...productSelection,
        [item.id]: (productSelection[item.id] || 0) + 1
      }))
    }
    const deleteProduct = () => {
      setProductSelection(productSelection => ({
        ...productSelection,
        [item.id]: productSelection[item.id] > 1 ? productSelection[item.id] - 1 : 0
      }))
    }
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : defaultProductImage}
        title={item.name}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        <TextSemiBold textStyle={styles.price}>{item.price.toFixed(2)}€</TextSemiBold>
        {!item.availability &&
          <TextRegular textStyle={styles.availability }>Not available</TextRegular>
        }
        {item.availability && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
         <Pressable
                onPress={() => {
                  deleteProduct()
                }}
            >
          <MaterialCommunityIcons name='minus-circle' color={brandPrimary} size={30}/>

            </Pressable>
            <TextRegular textStyle={styles.textcon}>{productSelection[item.id] || 0}</TextRegular>

            <Pressable
                onPress={() => {
                  addProduct()
                }}
            >
          <MaterialCommunityIcons name='plus-circle' color={brandPrimary} size={30}/>

            </Pressable>
            </View>

        )
  }
      </ImageCard>
    )
  }

  const renderEmptyProductsList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no products yet.
      </TextRegular>
    )
  }

  const fetchRestaurantDetail = async () => {
    try {
      const fetchedRestaurant = await getDetail(route.params.restaurantId)
      setRestaurant(fetchedRestaurant)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const validationSchema = yup.object().shape({
    products: yup.array().min(1),
    address: yup.string().max(255, 'Address code too long').required('Address is required')
  })

  const updateOrder = async (values) => {
    setBackendErrors([])
    try {
      const updatedOrder = await update(order.id, values)
      showMessage({
        message: `Order ${updatedOrder.id} succesfully updated`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('OrdersScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }
  const updateCounters = (fetchedOrder) => {
    const newCounters = fetchedOrder.products.reduce((acc, product) => {
      acc[product.id] = product.OrderProducts.quantity
      return acc
    }, {})
    setProductSelection(newCounters)
  }
  const createPrice = async (productSelection) => {
    setBackendErrors([])
    let total = 0
    try {
      const allProducts = Object.keys(productSelection)
      for (const key of allProducts) {
        const cuurentProduct = await getDetailP(key)
        const price = cuurentProduct.price * productSelection[key]
        total = total + price
      }
      return total
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <>
    <Formik
    enableReinitialize
    validationSchema={validationSchema}
    initialValues={initialOrderValues}
    onSubmit={updateOrder}
  >
    {({ handleSubmit, setFieldValue, values }) => (
      <>
      <ScrollView>
        <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyProductsList}
          style={styles.container}
          data={restaurant.products}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
        />

        {backendErrors &&
          backendErrors.map((error, index) => (
            <TextError key={index}>{error.msg}</TextError>
          ))}

      </ScrollView>
      <OrderModal
      isVisible={confirmador === 1}
      onCancel={() => setConfirmador(0)}
      onConfirm={ () => {
        handleSubmit()
        const newProducts = Object.keys(productSelection).map(key => ({ productId: key, quantity: productSelection[key] })).filter(product => product.quantity > 0)
        setFieldValue('products', newProducts)
        setConfirmador(0)
        setProductSelection({})
        updateOrder(values)
      }}
        >
        <View style={{ alignItems: 'center', width: '60%' } }>
            <InputItem
              name='address'
              label='Address:'
            />
        </View>
        <TextSemiBold textStyle={{ fontSize: 20 }}>Price: { orderPrice ? orderPrice.toFixed(2) : '0.00' }€</TextSemiBold>
        <TextSemiBold textStyle={{ fontSize: 20 }}>Shipping: { shipping ? shipping.toFixed(2) : '0.00' }€</TextSemiBold>
        <TextSemiBold textStyle={{ fontSize: 20 }}>Total: { finalPrice ? finalPrice.toFixed(2) : '0.00' }€</TextSemiBold>

    </OrderModal>
    </>
    )}
  </Formik>
</>
  )
}

const styles = StyleSheet.create({
  FRHeader: { // TODO: remove this style and the related <View>. Only for clarification purposes
    justifyContent: 'center',
    alignItems: 'left',
    margin: 50
  },

  container: {
    flex: 1
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: GlobalStyles.brandSecondary
  },
  restaurantHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
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
  textadd: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 4
  },
  textcon: {
    fontSize: 30,
    color: 'black',
    alignSelf: 'center',
    marginLeft: 4
  },
  availability: {
    textAlign: 'right',
    marginRight: 5,
    color: GlobalStyles.brandSecondary
  },
  actionButton1: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    marginRight: '1%',

    width: '40%'
  },
  actionButton2: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    marginLeft: '1%',
    width: '40%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  }
})
