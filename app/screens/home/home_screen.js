/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Dimensions,
    Image,
    Animated,
    PanResponder,
    TouchableOpacity,
    Share
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Download} from '../../utils';
import DeviceInfo from 'react-native-device-info';

const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width

const ARTICLES = [
    { id: "1", uri: require('../../../assets/1.jpg') },
    { id: "2", uri: require('../../../assets/2.jpg') },
    { id: "3", uri: require('../../../assets/3.jpg') },
    { id: "4", uri: require('../../../assets/4.jpg') }
]

export default class HomeScreen extends Component {

    constructor(props) {
        super(props)

        //this.position = new Animated.ValueXY(0)
        this.state = {
            pan: new Animated.ValueXY(),
            currentIndex: 0,
            show: false,
            memeData:[]
        }
        this.state.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                null,
                {
                    //dx: this.state.pan.x, // x,y are Animated.Value
                    dy: this.state.pan.y,
                },
            ]),
            onPanResponderRelease: (evt, gestureState) => {
                if(-gestureState.dy==0){
                    this.setState({show:!this.state.show})
                }
                if (-gestureState.dy > 50 && -gestureState.vy > 0.7) {
                    Animated.timing(this.state.pan, {
                        toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
                        duration: 400
                    }).start(() => {
                        console.log('pan', this.state.pan)
                        this.setState({ currentIndex: this.state.currentIndex + 1, show:false,pan: new Animated.ValueXY() })
                    })
                } else {
                    Animated.spring(this.state.pan, {
                        toValue: ({ x: 0, y: 0 })
                    }).start()
                }
            }
        });
    }

    componentDidMount() {
        this.getMemes()
    }

    getMemes() {
        //let id= DeviceInfo.getUniqueID();
        console.log("id.........: "+id)
        fetch('http://207.246.125.54/api/meme?deviceId=xZczvcxzvzxcvzxcv', {
            method: 'GET'
        }).then(response=>{
            
            if(response.status==200){
                return response.json()
            }
        }).then(responseJson=>{
           
            this.setState({memeData:responseJson.results})
        })
    }

    downloadImage(){
        let image_url=this.state.memeData[this.state.currentIndex].avatar
        Download.permission()
        Download.start(image_url)
    }

    
    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Meme Planet' +
                    '\n'+'Let me recommend you this application\n\n'
                    +"https://play.google.com/store/apps/details?id=com.inmeme",
            });

            if (result.action === Share.sharedAction) {

                if (result.activityType) {

                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


    renderArticles = () => {

        return this.state.memeData.map((item, i) => {
           
            if (i < this.state.currentIndex) {
                return null
            }
            if (i == this.state.currentIndex) {
              
                return (
                    <Animated.View key={item.id} style={this.state.pan.getLayout()}
                        {...this.state.panResponder.panHandlers}>
                        <View style={{
                            flex: 1,
                            position: 'absolute', height: SCREEN_HEIGHT,
                            width: SCREEN_WIDTH
                        }}>
                            <View style={{ flex: 2 }}>
                                <Image source={{uri:item.avatar}}
                                    style={{ flex: 1, height: null, width: null, resizeMode: 'center', backgroundColor: 'black' }} />
                            </View>
                        </View>
                    </Animated.View>
                )
            }
            else {
                return (
                    <Animated.View key={item.id} >
                        {console.log('false')}
                        <View style={{
                            flex: 1,
                            position: 'absolute', height: SCREEN_HEIGHT,
                            width: SCREEN_WIDTH
                        }}>
                            <View style={{ flex: 2 }}>
                                <Image source={{uri:item.avatar}}
                                    style={{ flex: 1, height: null, width: null, resizeMode: 'center', backgroundColor: 'black' }} />
                            </View>

                        </View>
                    </Animated.View>
                )
            }
        }).reverse()
    }


    openDrawer() {
        console.log('open drawer')
        this.props.navigation.openDrawer()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.show ?
                    <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.openDrawer()}>
                            <Icon size={25} name={'dehaze'} />
                        </TouchableOpacity>
                    </View>
                    :
                    (null)
                }
                <View style={{ flex: 12 }}>
                    {this.renderArticles()}
                </View>
                {this.state.show ? <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Icon size={25} name={'favorite-border'} />
                    <TouchableOpacity onPress={()=>this.downloadImage()}><Icon size={25} name={'file-download'} /></TouchableOpacity>
                   <TouchableOpacity  onPress={()=>this.onShare()}><Icon size={25} name={'share'} /></TouchableOpacity>
                </View> : (null)}
            </View>
        )
    }
}
