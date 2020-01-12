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
import { Download } from '../../utils';

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
            memeData: []
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
        fetch('http://207.246.125.54/api/meme?deviceId=12345', {
            method: 'GET'
        }).then(response => {
            console.log('response', response)
            if (response.status == 200) {
                return response.json()
            }
        }).then(responseJson => {
            console.log('responseJson', responseJson)
            this.setState({ memeData: responseJson.results })
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
            console.log('index', i, "pan", this.state.pan)
            if (i == this.state.currentIndex - 1) {
                return (<Animated.View key={item.id} style={this.state.swiped.getLayout()}
                    {...this.panResponder.panHandlers}>
                    <View style={{
                        flex: 1,
                         height: SCREEN_HEIGHT,
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
                console.log('true')
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
                    <TouchableOpacity><Icon size={25} name={'favorite-border'} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.downloadImage()}><Icon size={25} name={'file-download'} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onShare()}><Icon size={25} name={'share'} /></TouchableOpacity>
                </View> : (null)}
            </View>
        )
    }
}
