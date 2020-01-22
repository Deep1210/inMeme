import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions,StackActions} from 'react-navigation';
import {ScrollView, Text, View,Image,TouchableOpacity, Alert,AsyncStorage,FlatList} from 'react-native';
import styles from './sidemenu.style';


class SideMenu extends Component {
    navigateToScreen = (route) => () => {

        const navigateAction = NavigationActions.navigate({
            routeName: route,
        });
        this.props.navigation.navigate('Home')
    };

    constructor(props){
        super(props);
        this.state={
            name:'Person name',
            email:'',
            category:[]
        }

    }

    componentWillMount(){

        this._getNumberValue();

    }

    async _getNumberValue(){
        
        fetch('http://207.246.125.54/api/category', {
            method: 'GET'
        }).then(response => {
           
            if (response.status == 200) {
                return response.json()
            }
        }).then(responseJson => {
            let data = [];
            let allValue={
                title:"All",
                id:0
            }
            
            data=responseJson.results.filter((data)=>
            data.title.toLowerCase()!=='hindi' && data.title.toLowerCase()!=='english' 
            && data.title.toLowerCase()!=='hinglish' 
            )
            data.push(allValue);
            console.log("response\...........: ",data)
            this.setState({ category: data })
        })
    }

    navigateToScreen = (categoryId) => () => {
        AsyncStorage.setItem('categoryId',""+categoryId)
        this.props.navigation.navigate('Home',{'catId':categoryId})
        this.props.navigation.closeDrawer()
    };


    render () {
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.name}>Categories</Text>
                </View>
                <View style={styles.mainContainer}>
                    {this.state.category.map((value,index)=>{
                        if(value.title==="All"){
                            return(
                                <TouchableOpacity 
                                style={styles.containerStyle} onPress={this.navigateToScreen(value.id)}>
                                    <Image source={require('./allmeme.png')}
                                    style={{
                                        height: 70,
                                        width: 100
                                        }}></Image>
                               
                                <Text style={styles.bodyContent}>{value.title}</Text>
                                
                            </TouchableOpacity>
                            )
                        }else{
                        return(
                            <TouchableOpacity 
                            style={styles.containerStyle} onPress={this.navigateToScreen(value.id)}>
                               <Image source={{uri: value.avatar}}
                                        style={{
                                        height: 100,
                                        width: 100
                                        }}></Image>
                                <Text style={styles.bodyContent}>{value.title}</Text>
                                
                            </TouchableOpacity>
                        )
                        }
                    })}
                </View>
                </ScrollView>
            </View>
        );
    }

    onClickLogout(){
        Alert.alert(
            'Are you sure to logout',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress:this.onPressOk.bind(this) },
            ],
            { cancelable: false }
        )
    }

    async onPressOk() {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('number');
            await AsyncStorage.removeItem('name');
            await AsyncStorage.removeItem('email');
            this.props.navigation.navigate('Login');
        } catch (error) {

        }
    }

}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;