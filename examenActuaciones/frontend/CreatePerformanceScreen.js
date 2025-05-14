import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup'
import { create } from '../../api/PerformanceEndpoints'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { Formik } from 'formik'
import TextError from '../../components/TextError'

export default function CreatePerformanceScreen ({ navigation, route }){
    
    const [backendErrors, setBackendErrors] = useState()
    const initialPerformanceValues = { group: null, appointment: null, restaurantId: route.params.id }
    const validationSchema = yup.object().shape({
        group: yup
        .string()
        .min(1, 'Name too short')
        .max(255, 'Name too long')
        .required('Group is required'),
        appointment: yup
        .date()
        .required('The appointment date is required')
    })
    
    const createPerformance = async (values) => {setBackendErrors([])
        try {
            const createdPerformance = await create(values)
            showMessage({message: `Performance ${createdPerformance.group} succesfullycreated`,
            type: 'success',
            style: GlobalStyles.flashStyle,
            titleStyle: GlobalStyles.flashTextStyle
            }) 
            navigation.navigate('RestaurantsScreen', { dirty: true })
        } catch (error) {
            console.log(error)
            setBackendErrors(error.errors)
            }
        }
    return (
        <Formik
        validationSchema={validationSchema}
        initialValues={initialPerformanceValues}
        onSubmit={createPerformance}>
        {({ handleSubmit }) => (
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                <View style={{ width: '60%' }}>
                    <InputItem
                        name='group'
                        label='Group:'
                    />
                    <InputItem
                        name='appointment'
                        label='Appointment:'
                    />
                    {backendErrors && 
                        backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
                    }

                <Pressable
                    onPress={handleSubmit}
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed
                            ? GlobalStyles.brandSuccessTap
                            : GlobalStyles.brandSuccess
                        },
                        styles.button
                    ]}>
                    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                        <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                        <TextRegular textStyle={styles.text}>
                            Save
                        </TextRegular>
                    </View>
                    </Pressable>
                </View>
                </View>
        </ScrollView>
        )}
        </Formik>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        height: 40,
        padding: 10,
        width: '100%',
        marginTop: 20,
        marginBottom: 20
    },
    text: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginLeft: 5
    },
    imagePicker: {
        height: 40,
        paddingLeft: 10,
        marginTop: 20,
        marginBottom: 80
    },
    image: {
        width: 100,
        height: 100,
        borderWidth: 1,
        alignSelf: 'center',
        marginTop: 5
    }
})