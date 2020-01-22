/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
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
  Share,
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Download} from '../../utils';
import {NavigationEvents} from 'react-navigation';
import Loader from '../../components/Loader';
import ModalDropdown from 'react-native-modal-dropdown';
import DeviceInfo from 'react-native-device-info';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    //this.position = new Animated.ValueXY(0)
    this.state = {
      pan: new Animated.ValueXY(),
      swiped: new Animated.ValueXY({x: 0, y: -SCREEN_HEIGHT}),
      currentIndex: 0,
      show: false,
      language:0,
      memeData: [],
      loading: true,
      noMoreContent: false,
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0 && this.state.currentIndex > 0) {
          this.state.swiped.setValue({
            x: 0,
            y: -SCREEN_HEIGHT + gestureState.dy,
          });
        } else {
          this.state.pan.setValue({x: 0, y: gestureState.dy});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log(this.state.swiped)
        if (-gestureState.dy == 0) {
          this.setState({show: !this.state.show});
        }
        if (
          this.state.currentIndex > 0 &&
          gestureState.dy > 50 &&
          gestureState.vy > 0.7
        ) {
          Animated.timing(this.state.swiped, {
            toValue: {x: 0, y: 0},
            duration: 400,
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex - 1});
            this.state.swiped.setValue({x: 0, y: -SCREEN_HEIGHT});
          });
        } else if (-gestureState.dy > 50 && -gestureState.vy > 0.7) {
          Animated.timing(this.state.pan, {
            toValue: {x: 0, y: -SCREEN_HEIGHT},
            duration: 400,
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1});
            this.state.pan.setValue({x: 0, y: 0});
          });
        } else {
          Animated.parallel([
            Animated.spring(this.state.pan, {
              toValue: {x: 0, y: 0},
            }),
            Animated.spring(this.state.swiped, {
              toValue: {x: 0, y: -SCREEN_HEIGHT},
            }),
          ]).start();
        }
      },
    });
  }

  componentDidMount() {
    this.getMemes();
  }

  componentDidUpdate(prevState) {
    // if (prevState.memeData != this.state.memeData) {
    //     if (this.state.currentIndex % 2 === 0) {
    //         AdMobInterstitial.setAdUnitID('ca-app-pub-4520361263876285/7772038802');
    //         AdMobInterstitial.requestAd(AdMobInterstitial.showAd);
    //     }
    // }
  }

  componentWillReceiveProps() {
    AsyncStorage.getItem('categoryId').then(response => {
      this.setState({
        noMoreContent: false,
        currentIndex: 0,
        loading: true,
      });
      if (response === '0') {
        this.getMemes(undefined);
      } else {
        this.getMemes(response);
      }
    });
  }

  getMemes(id) {
    let uniqueId = DeviceInfo.getUniqueId();

    if (id) {
      fetch(
        `http://207.246.125.54/api/meme?device=${uniqueId}&category=${id}&language=${this.state.language}`,
        {
          method: 'GET',
        },
      )
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then(responseJson => {
          if (responseJson.results.length > 0) {
            this.setState({memeData: responseJson.results, loading: false});
          } else {
            this.setState({
              memeData: responseJson.results,
              loading: false,
              noMoreContent: true,
            });
          }
        });
    } else {
      fetch(`http://207.246.125.54/api/meme?device=${uniqueId}&language=${this.state.language}`, {
        method: 'GET',
      })
        .then(response => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then(responseJson => {
          this.setState({memeData: responseJson.results, loading: false});
        });
    }
  }

  downloadImage() {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ).then(response => {
      console.log('inMeme', response);
      if (response) {
        let image_url = this.state.memeData[this.state.currentIndex].avatar;
        Download.start(image_url);
      } else {
        let check = Download.permission();
        if (check) {
          let image_url = this.state.memeData[this.state.currentIndex].avatar;
          Download.start(image_url);
        } else {
          //do nothing
        }
      }
    });
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Meme Planet' +
          '\n' +
          'Let me recommend you this application\n\n' +
          'https://play.google.com/store/apps/details?id=com.inmeme',
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
    return this.state.memeData
      .map((item, i) => {
        if (this.state.currentIndex == this.state.memeData.length) {
          this.setState({noMoreContent: true});
        }
        if (i == this.state.currentIndex - 1) {
          return (
            <Animated.View
              key={item.id}
              style={this.state.swiped.getLayout()}
              {...this.panResponder.panHandlers}>
              <View
                style={{
                  flex: 1,
                  height: SCREEN_HEIGHT,
                  width: SCREEN_WIDTH,
                }}>
                <View style={{flex: 2}}>
                  <Image
                    source={{uri: item.avatar}}
                    style={{
                      flex: 1,
                      height: null,
                      width: null,
                      resizeMode: 'center',
                      backgroundColor: 'black',
                    }}
                  />
                </View>
              </View>
            </Animated.View>
          );
        } else if (i < this.state.currentIndex) {
          return null;
        }
        if (i == this.state.currentIndex) {
          return (
            <Animated.View
              key={item.id}
              style={this.state.pan.getLayout()}
              {...this.panResponder.panHandlers}>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  height: SCREEN_HEIGHT,
                  width: SCREEN_WIDTH,
                }}>
                <View style={{flex: 2}}>
                  <Image
                    source={{uri: item.avatar}}
                    style={{
                      flex: 1,
                      height: null,
                      width: null,
                      resizeMode: 'center',
                      backgroundColor: 'black',
                    }}
                  />
                </View>
              </View>
            </Animated.View>
          );
        } else {
          return (
            <Animated.View key={item.id}>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  height: SCREEN_HEIGHT,
                  width: SCREEN_WIDTH,
                }}>
                <View style={{flex: 2}}>
                  <Image
                    source={{uri: item.avatar}}
                    style={{
                      flex: 1,
                      height: null,
                      width: null,
                      resizeMode: 'center',
                      backgroundColor: 'black',
                    }}
                  />
                </View>
              </View>
            </Animated.View>
          );
        }
      })
      .reverse();
  };

  openDrawer() {
    this.props.navigation.openDrawer();
  }

  getColor() {
    if (this.state.memeData[this.state.currentIndex]) {
      if (this.state.memeData[this.state.currentIndex].like) {
        return 'red';
      } else {
        return 'black';
      }
    } else {
      return 'black';
    }
  }

  clickLike() {
    let uniqueId = DeviceInfo.getUniqueId();
    let data = {
      device_id: uniqueId,
      meme: this.state.memeData[this.state.currentIndex].id,
    };
    fetch(
      `http://207.246.125.54/api/meme/${
        this.state.memeData[this.state.currentIndex].id
      }/like-unlike/`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    )
      .then(response => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then(responseJson => {
        AsyncStorage.getItem('categoryId').then(response => {
          console.log(response);
          if (response === '0') {
            this.getMemes(undefined);
          } else {
            this.getMemes(response);
          }
        });
      });
  }

  selectLanguage(value){
    console.log(value)
    if(value==='Hindi'){
      this.setState({
        language:1
      })

      AsyncStorage.getItem('categoryId').then(response => {
        this.setState({
          noMoreContent: false,
          currentIndex: 0,
          loading: true,
        });
        if (response === '0') {
          this.getMemes(undefined);
        } else {
          this.getMemes(response);
        }
      });
    }else if(value==='English'){
      this.setState({
        language:0
      })
      AsyncStorage.getItem('categoryId').then(response => {
        this.setState({
          noMoreContent: false,
          currentIndex: 0,
          loading: true,
        });
        if (response === '0') {
          this.getMemes(undefined);
        } else {
          this.getMemes(response);
        }
      });
    }else{
      this.setState({
        language:2
      })
      AsyncStorage.getItem('categoryId').then(response => {
        this.setState({
          noMoreContent: false,
          currentIndex: 0,
          loading: true,
        });
        if (response === '0') {
          this.getMemes(undefined);
        } else {
          this.getMemes(response);
        }
      });
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Loader loading={this.state.loading} />
        {this.state.show || this.state.noMoreContent ? (
          <View
            style={{
              backgroundColor: 'white',
              flex: 1,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => this.openDrawer()}
              style={{marginLeft: '1%'}}>
              <Icon size={25} name={'dehaze'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.openDrawer()}
              style={{marginLeft: '84%'}}>
              {
                // <Icon size={25} name={'toc'} />
              }
              <ModalDropdown
                dropdownStyle={{width: 100, height: 110}}
                dropdownTextStyle={{color: 'black'}}
                defaultValue={'English'}
                defaultIndex={0}
                dropdownTextHighlightStyle={{color: 'red'}}
                options={['English', 'Hindi', 'Hinglish']}
                onSelect={(index, value) => this.selectLanguage(value)}>
                <Icon size={25} name={'toc'} />
              </ModalDropdown>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.noMoreContent ? (
          <View
            style={{flex: 12, justifyContent: 'center', alignItems: 'center'}}>
            <Icon size={80} name={'insert-photo'} style={{color: '#d3d3d3'}} />
            <Text style={{fontSize: 30, textAlign: 'center', color: '#d3d3d3'}}>
              No More Memes
            </Text>
          </View>
        ) : (
          <View style={{flex: 12}}>{this.renderArticles()}</View>
        )}
        {this.state.show && !this.state.noMoreContent ? (
          <View
            style={{
              backgroundColor: 'white',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.clickLike()}
              style={{flexDirection: 'row'}}>
              <Icon
                size={25}
                name={'favorite-border'}
                style={{color: this.getColor()}}
              />
              <Text style={{fontSize: 16}}>
                {this.state.memeData[this.state.currentIndex]
                  ? this.state.memeData[this.state.currentIndex].vote
                  : null}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.downloadImage()}>
              <Icon size={25} name={'file-download'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onShare()}>
              <Icon size={25} name={'share'} />
            </TouchableOpacity>
          </View>
        ) : null}
        <AdMobBanner
          adSize="fullBanner"
          adUnitID="ca-app-pub-4520361263876285/4705277361"
          didFailToReceiveAdWithError={error => console.log(error)}
        />
      </View>
    );
  }
}
