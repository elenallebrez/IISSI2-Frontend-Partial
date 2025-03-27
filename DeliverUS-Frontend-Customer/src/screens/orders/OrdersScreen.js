import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, FlatList, View, Pressable } from 'react-native'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import ImageCard from '../../components/ImageCard'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getAllOrders, remove } from '../../api/OrderEndpoints'
import { showMessage } from 'react-native-flash-message'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import DeleteModal from '../../components/DeleteModal.js'

export default function OrdersScreen ({ navigation, route }) {
  const [orders, setOrders] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)
  const [orderToBeDeleted, setOrderToBeDeleted] = useState(null)

  useEffect(() => {
    if (loggedInUser) {
      fetchOrders()
    } else {
      setOrders(null)
    }
  }, [loggedInUser, route])

  async function fetchOrders () {
    try {
      const fetchedOrders = await getAllOrders()
      const sortedOrders = fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(sortedOrders)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving orders. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  async function removeOrder (order) {
    try {
      await remove(order.id)
      await fetchOrders()
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.id} successfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      setOrderToBeDeleted(null)
      showMessage({
        message: `Order ${order.id} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderOrder = ({ item }) => {
    return (
      <ImageCard
       imageUri = {item.restaurant.logo ? { uri: process.env.API_BASE_URL + '/' + item.restaurant.logo } : restaurantLogo}
       title= {item.restaurant.name}
       onPress={() => {
         navigation.navigate('OrderDetailScreen', { id: item.id })
       }}
      >
       <TextSemiBold textStyle={{ color: 'black' }}>Status: <TextSemiBold textStyle={item.status === 'in process' ? { color: GlobalStyles.brandSecondary } : item.status === 'sent' ? { color: GlobalStyles.brandGreen } : item.status === 'delivered' ? { color: 'blue' } : { color: GlobalStyles.brandPrimary }}>{item.status}</TextSemiBold></TextSemiBold>
       <TextSemiBold>Price: <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}> {item.price.toFixed(2)}€ </TextSemiBold></TextSemiBold>
       {item.status === 'pending' &&
       <View style={styles.actionButtonsContainer}>
       <Pressable
         onPress={() => navigation.navigate('EditOrderScreen', { id: item.id, restaurantId: item.restaurantId })
         }
         style={({ pressed }) => [
           {
             backgroundColor: pressed
               ? GlobalStyles.brandBlueTap
               : GlobalStyles.brandBlue
           },
           styles.actionButton
         ]}>
       <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
         <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
         <TextRegular textStyle={styles.text}>
           Edit
         </TextRegular>
       </View>
     </Pressable>

        <Pressable
             onPress={() => { setOrderToBeDeleted(item) }}
             style={({ pressed }) => [
               {
                 backgroundColor: pressed
                   ? GlobalStyles.brandPrimaryTap
                   : GlobalStyles.brandPrimary
               },
               styles.actionButton
             ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='delete' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Delete
            </TextRegular>
          </View>
        </Pressable>
        </View>
       }
      </ImageCard>
    )
  }

  const renderEmptyOrdersList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No orders were retreived. Are you logged in?
      </TextRegular>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.container}
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyOrdersList}
      />
      <DeleteModal
          isVisible={orderToBeDeleted !== null}
          onCancel={() => setOrderToBeDeleted(null)}
          onConfirm={() => removeOrder(orderToBeDeleted)}>
          <TextRegular>The products of this order will be deleted as well</TextRegular>
        </DeleteModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
