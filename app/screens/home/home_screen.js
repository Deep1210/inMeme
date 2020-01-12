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
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
            show: false
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
                if (-gestureState.dy > 50 && -gestureState.vy > 0.7) {
                    Animated.timing(this.state.pan, {
                        toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
                        duration: 400
                    }).start(() => {
                        console.log('pan', this.state.pan)
                        this.setState({ currentIndex: this.state.currentIndex + 1, pan: new Animated.ValueXY() })
                    })
                } else {
                    Animated.spring(this.state.pan, {
                        toValue: ({ x: 0, y: 0 })
                    }).start()
                }
            }
        });
    }


    renderArticles = () => {

        return ARTICLES.map((item, i) => {
            console.log('index', i, "pan", this.state.pan)
            if (i < this.state.currentIndex) {
                return null
            }
            if (i == this.state.currentIndex) {
                console.log('true')
                return (
                    <Animated.View key={item.id} style={this.state.pan.getLayout()}
                        {...this.state.panResponder.panHandlers}>
                        <View style={{
                            flex: 1,
                            position: 'absolute', height: SCREEN_HEIGHT,
                            width: SCREEN_WIDTH
                        }}>
                            <View style={{ flex: 2 }}>
                                <Image source={ARTICLES[i].uri}
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
                                <Image source={ARTICLES[i].uri}
                                    style={{ flex: 1, height: null, width: null, resizeMode: 'center', backgroundColor: 'black' }} />
                            </View>

                        </View>
                    </Animated.View>
                )
            }
        }).reverse()
    }

    showHide() {
        this.setState({ show: !this.state.show })
    }

    openDrawer() {
        console.log('open drawer')
        this.props.navigation.openDrawer()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.show ?
                    <View style={{ backgroundColor: 'white', flex: 1,justifyContent:'center' }}>
                        <TouchableOpacity onPress={() => this.openDrawer()}>
                            <Icon size={25} name={'dehaze'} />
                        </TouchableOpacity>
                    </View>
                    :
                    (null)
                }
                <View style={{ flex: 12 }} onTouchEndCapture={() => this.showHide()}>
                    {this.renderArticles()}
                </View>
                {this.state.show ? <View style={{ backgroundColor: 'white', flex: 1, flexDirection: 'row',justifyContent:'space-evenly',alignItems:'center' }}>
                    <Icon size={25} name={'favorite-border'} />
                    <Icon size={25} name={'file-download'} />
                    <Icon size={25} name={'share'} />
                </View> : (null)}
            </View>
        )
    }
}
