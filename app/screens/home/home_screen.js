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
import { ThemeColors } from 'react-navigation';
import Loader from "../../components/Loader";
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
  } from 'react-native-admob'


const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width


export default class HomeScreen extends Component {

    constructor(props) {
        super(props)

        //this.position = new Animated.ValueXY(0)
        this.state = {
            pan: new Animated.ValueXY(),
            swiped: new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT }),
            currentIndex: 0,
            show: false,
            memeData: [],
            loading:true
        }
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0 && (this.state.currentIndex > 0)) {
                    this.state.swiped.setValue({
                        x: 0, y: -SCREEN_HEIGHT + gestureState.dy
                    })
                } else {
                    this.state.pan.setValue({ x: 0, y: gestureState.dy })
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (-gestureState.dy == 0) {
                    this.setState({ show: !this.state.show })
                }
                if (this.state.currentIndex > 0 && gestureState.dy > 50 && gestureState.vy > 0.7) {
                    Animated.timing(this.state.swiped, {
                        toValue: ({ x: 0, y: 0 }),
                        duration: 400
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex - 1 })
                        this.state.swiped.setValue({ x: 0, y: -SCREEN_HEIGHT })
                    })
                }
                else if (-gestureState.dy > 50 && -gestureState.vy > 0.7) {
                    Animated.timing(this.state.pan, {
                        toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
                        duration: 400
                    }).start(() => {
                        console.log('pan', this.state.pan)
                        this.setState({ currentIndex: this.state.currentIndex + 1 })
                        this.state.pan.setValue({ x: 0, y: 0 })
                    })
                } else {
                    Animated.parallel([
                        Animated.spring(this.state.pan, {
                            toValue: ({ x: 0, y: 0 })
                        }),
                        Animated.spring(this.state.swiped, {
                            toValue: ({ x: 0, y: -SCREEN_HEIGHT })
                        })
                    ]).start()
                }
            }
        });
    }

    componentDidMount() {
        this.getMemes()
    }

    getMemes() {
        //let id= DeviceInfo.getUniqueID();
       // console.log("id.........: "+id)
        fetch('http://207.246.125.54/api/meme?deviceId=xZczvcxzvzxcvzxcv', {
            method: 'GET'
        }).then(response=>{
            
            if(response.status==200){
                return response.json()
            }
        }).then(responseJson=>{
           
            this.setState({memeData:responseJson.results,loading:false})
        })
    }

    downloadImage() {
        let image_url = this.state.memeData[this.state.currentIndex].avatar
        Download.permission()
        Download.start(image_url)
    }


    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Meme Planet' +
                    '\n' + 'Let me recommend you this application\n\n'
                    + "https://play.google.com/store/apps/details?id=com.inmeme",
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
           
            if (i == this.state.currentIndex - 1) {
                return (<Animated.View key={item.id} style={this.state.swiped.getLayout()}
                    {...this.panResponder.panHandlers}>
                    <View style={{
                        flex: 1,
                        position: 'absolute', height: SCREEN_HEIGHT,
                        width: SCREEN_WIDTH
                    }}>
                        <View style={{ flex: 2 }}>
                            <Image source={{ uri: item.avatar }}
                                style={{ flex: 1, height: null, width: null, resizeMode: 'center', backgroundColor: 'black' }} />
                        </View>
                    </View>
                </Animated.View>)
            }
            else if (i < this.state.currentIndex) {
                return null
            }
            if (i == this.state.currentIndex) {
              
                return (
                    <Animated.View key={item.id} style={this.state.pan.getLayout()}
                        {...this.panResponder.panHandlers}>
                        <View style={{
                            flex: 1,
                            position: 'absolute', height: SCREEN_HEIGHT,
                            width: SCREEN_WIDTH
                        }}>
                            <View style={{ flex: 2 }}>
                                <Image source={{ uri: item.avatar }}
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
                                <Image source={{ uri: item.avatar }}
                                    style={{ flex: 1, height: null, width: null, resizeMode: 'center', backgroundColor: 'black' }} />
                            </View>

                        </View>
                    </Animated.View>
                )
            }
        }).reverse()
    }


    openDrawer() {
        this.props.navigation.openDrawer()
    }

    render() {
       // AdMobInterstitial.setAdUnitID('ca-app-pub-4520361263876285/7772038802');
        //AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
        return (
            <View style={{ flex: 1 }}>
                
                {this.state.currentIndex%2===0?
                <AdMobBanner
                    adSize="fullBanner"
                    adUnitID='ca-app-pub-4520361263876285/7772038802'
                    testDevices={[AdMobBanner.simulatorId]}
                    onAdFailedToLoad={error => console.error(error)}
                />
                :null}
                 <Loader loading={this.state.loading} />
                {this.state.show ?
                    <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center',flexDirection:'row' }}>
                        <TouchableOpacity onPress={() => this.openDrawer()} style={{marginLeft:'1%'}}>
                            <Icon size={25} name={'dehaze'} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.openDrawer()} style={{marginLeft:'85%'}}>
                            <Icon size={25} name={'toc'} />
                        </TouchableOpacity>
                    </View>
                    :
                    (null)
                }
                <View style={{ flex: 12 }}>
                    {this.renderArticles()}
                </View>
                {this.state.show ? <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.setState({
                    ["isLike"+this.state.currentIndex]:!this.state["isLike"+this.state.currentIndex]
                })} style={{flexDirection:'row'}}>
                    <Icon size={25} name={'favorite-border'} 
                    style={{color:this.state["isLike"+this.state.currentIndex]?'red':'black'}}/>
                    <Text style={{fontSize:16}}>
                        {this.state.memeData[this.state.currentIndex]?
                    this.state.memeData[this.state.currentIndex].vote:null}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.downloadImage()}><Icon size={25} name={'file-download'} /></TouchableOpacity>
                <TouchableOpacity onPress={() => this.onShare()}><Icon size={25} name={'share'} /></TouchableOpacity>
                </View> : (null)}
            </View>
        )
    }
}
