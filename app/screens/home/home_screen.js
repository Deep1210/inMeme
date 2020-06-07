/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import Swiper from 'react-native-deck-swiper';
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
  TouchableWithoutFeedback,
  Share,
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Download, OnShare } from '../../utils';
import { NavigationEvents } from 'react-navigation';
import Loader from '../../components/Loader';
import ModalDropdown from 'react-native-modal-dropdown';
import DeviceInfo from 'react-native-device-info';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import imageCacheHoc from 'react-native-image-cache-hoc';
import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';

const placeHolderImage = require('../home/placeholder.png');

const propOverridePlaceholderObject = {
  component: Image,
  props: {
    source: { placeHolderImage },
  },
};

const CacheableImage = imageCacheHoc(Image, {
  fileHostWhitelist: ['207.246.125.54'],
});

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    //this.position = new Animated.ValueXY(0)
    this.state = {
      pan: new Animated.ValueXY(),
      swiped: new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT }),
      currentIndex: 0,
      show: false,
      language: 2,
      memeData: [],
      page: 1,
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
          this.state.pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (-gestureState.dy == 0) {
          this.setState({ show: !this.state.show });
        }
        if (
          this.state.currentIndex > 0 &&
          gestureState.dy > 50 &&
          gestureState.vy > 0.7
        ) {
          Animated.timing(this.state.swiped, {
            toValue: { x: 0, y: 0 },
            duration: 400,
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex - 1 });
            this.state.swiped.setValue({ x: 0, y: -SCREEN_HEIGHT });
          });
        } else if (-gestureState.dy > 50 && -gestureState.vy > 0.7) {
          Animated.timing(this.state.pan, {
            toValue: { x: 0, y: -SCREEN_HEIGHT },
            duration: 400,
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 });
            this.state.pan.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.parallel([
            Animated.spring(this.state.pan, {
              toValue: { x: 0, y: 0 },
            }),
            Animated.spring(this.state.swiped, {
              toValue: { x: 0, y: -SCREEN_HEIGHT },
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
        page: 1,
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
    console.log(
      'url.............:::',
      `http://207.246.125.54/api/meme?device=${uniqueId}&language=${this.state.language}&page=${this.state.page}`,
    );
    if (id) {
      fetch(
        `http://207.246.125.54/api/meme?device=${uniqueId}&category=${id}&language=${this.state.language}&page=${this.state.page}`,
        {
          method: 'GET',
        },
      )
        .then(response => {
          if (response.status == 200) {
            return response.json();
          } else {
            this.setState({ memeData: [], noMoreContent: true, loading: false });
          }
        })
        .then(responseJson => {
          console.log('results///////........: ', responseJson.results);
          if (responseJson.results.length > 0) {
            if (this.state.page === 1) {
              this.setState({ memeData: responseJson.results, loading: false });
            } else {
              this.setState({
                memeData: this.state.memeData.concat(responseJson.results),
                loading: false,
              });
            }
          } else {
            this.setState({
              memeData: responseJson.results,
              loading: false,
              noMoreContent: true,
            });
          }
        });
    } else {
      console.log(
        'url.............:::',
        `http://207.246.125.54/api/meme?device=${uniqueId}&language=${this.state.language}&page=${this.state.page}`,
      );
      fetch(
        `http://207.246.125.54/api/meme?device=${uniqueId}&language=${this.state.language}&page=${this.state.page}`,
        {
          method: 'GET',
        },
      )
        .then(response => {
          if (response.status == 200) {
            return response.json();
          } else {
            this.setState({ memeData: [], noMoreContent: true, loading: false });
          }
        })
        .then(responseJson => {
          console.log('results///////........: ', responseJson.results);
          if (responseJson.results.length > 0) {
            if (this.state.page === 1) {
              this.setState({ memeData: responseJson.results, loading: false });
            } else {
              this.setState({
                memeData: this.state.memeData.concat(responseJson.results),
                loading: false,
              });
            }
          } else {
            this.setState({
              memeData: responseJson.results,
              noMoreContent: true,
              loading: false,
            });
          }
        })
        .catch(err => {
          console.log('error :', err);
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
      let url = this.state.memeData[this.state.currentIndex]
        ? this.state.memeData[this.state.currentIndex].avatar
        : '';
      const result = await Share.share({
        message:
          'Check out Inmeme app. I found it best for watching current memes, indian memes and  jokes.\n\n' +
          'https://play.google.com/store/apps/details?id=com.inmemes',
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

  convertToBase64(title, image) {
    console.log('convert base 64 called');
    let imagePath = null;
    let image_url = image;
    let image_url_length = image_url.length;
    console.log('image_url_length', image_url_length);

    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', image_url)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        // here's base64 encoded image
        if (
          image_url.substring(image_url_length - 3, image_url_length) === 'mp4'
        )
          base64Data = 'data:video/mp4;base64,' + base64Data;
        else base64Data = 'data:image/png;base64,' + base64Data;

        this.setState({ base64Image: base64Data });
        this.onShared(title);
        // remove the file from storage
        return fs.unlink(imagePath);
      });
  }

  onShared(title) {
    console.log('share called');
    OnShare.share(title, this.state.base64Image);
  }

  // renderArticles = () => {
  //   return this.state.memeData
  //     .map((item, i) => {
  //       if (this.state.currentIndex == this.state.memeData.length) {
  //         this.setState({ noMoreContent: true });
  //       }
  //       if (i == this.state.currentIndex - 1) {
  //         return (
  //           <Animated.View
  //             key={item.id}
  //             style={this.state.swiped.getLayout()}
  //             {...this.panResponder.panHandlers}>
  //             <View
  //               style={{
  //                 flex: 1,
  //                 height: SCREEN_HEIGHT,
  //                 width: SCREEN_WIDTH,
  //               }}>
  //               <View style={{ flex: 2 }}>
  //                 <Image
  //                   source={{ uri: item.avatar }}
  //                   style={{
  //                     flex: 1,
  //                     height: null,
  //                     width: null,
  //                     resizeMode: 'center',
  //                     backgroundColor: 'black',
  //                   }}
  //                 />
  //               </View>
  //             </View>
  //           </Animated.View>
  //         );
  //       } else if (i < this.state.currentIndex) {
  //         return null;
  //       }
  //       if (i == this.state.currentIndex) {
  //         return (
  //           <Animated.View
  //             key={item.id}
  //             style={this.state.pan.getLayout()}
  //             {...this.panResponder.panHandlers}>
  //             <View
  //               style={{
  //                 flex: 1,
  //                 position: 'absolute',
  //                 height: SCREEN_HEIGHT,
  //                 width: SCREEN_WIDTH,
  //               }}>
  //               <View style={{ flex: 2 }}>
  //                 <Image
  //                   source={{ uri: item.avatar }}
  //                   style={{
  //                     flex: 1,
  //                     height: null,
  //                     width: null,
  //                     resizeMode: 'center',
  //                     backgroundColor: 'black',
  //                   }}
  //                 />
  //               </View>
  //             </View>
  //           </Animated.View>
  //         );
  //       } else {
  //         return (
  //           <Animated.View key={item.id}>
  //             <View
  //               style={{
  //                 flex: 1,
  //                 position: 'absolute',
  //                 height: SCREEN_HEIGHT,
  //                 width: SCREEN_WIDTH,
  //               }}>
  //               <View style={{ flex: 2 }}>
  //                 <Image
  //                   source={{ uri: item.avatar }}
  //                   style={{
  //                     flex: 1,
  //                     height: null,
  //                     width: null,
  //                     resizeMode: 'center',
  //                     backgroundColor: 'black',
  //                   }}
  //                 />
  //               </View>
  //             </View>
  //           </Animated.View>
  //         );
  //       }
  //     })
  //     .reverse();
  // };

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
          if (response === '0') {
            this.getMemes(undefined);
          } else {
            this.getMemes(response);
          }
        });
      });
  }

  selectLanguage(value) {
    if (value === 'Hindi') {
      this.setState({
        language: 1,
        page: 1,
      });

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
    } else if (value === 'English') {
      this.setState({
        language: 0,
        page: 1,
      });
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
    } else {
      this.setState({
        language: 2,
        page: 1,
      });
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

  setCurrentIndex(currentIndexNumber) {
    if (currentIndexNumber >= 0) {
      if (this.state.memeData.length === currentIndexNumber + 1) {
        AsyncStorage.getItem('categoryId').then(response => {
          this.setState({
            noMoreContent: false,
            currentIndex: 0,
            loading: true,
            page: this.state.page + 1,
            currentIndex: currentIndexNumber,
          });
          console.log(response);
          if (response === '0') {
            this.getMemes(undefined);
          } else {
            this.getMemes(response);
          }
        });
      } else {
        this.setState({
          currentIndex: currentIndexNumber,
        });
      }
    } else {
      this.setState({
        currentIndex: 0,
      });
    }
  }

  renderArticles(data) {
    return (
      <Swiper
        cards={data}
        ref={swiper => {
          this.swiper = swiper;
        }}
        stackSize={2}
        renderCard={card => {
          return (
            <TouchableWithoutFeedback
              onPress={() => this.setState({ show: !this.state.show })}
              style={{
                flex: 1,
                height: SCREEN_HEIGHT,
                width: SCREEN_WIDTH,
                borderRadius: 10,
              }}>
              <FastImage
                source={{
                  uri: data.length > 0 ? (card ? card.avatar : '') : '',
                  cache: FastImage.cacheControl.immutable,
                }}
                resizeMode={FastImage.resizeMode.contain}
                style={{
                  flex: 1,
                  height: null,
                  width: null,
                  backgroundColor: 'black',
                }}
              />
            </TouchableWithoutFeedback>
          );
        }}
        swipeBackCard
        disableRightSwipe={true}
        disableLeftSwipe={true}
        //onSwipedTop={(cardIndex) => { this.setCurrentIndex(cardIndex) }}
        //onSwipedBottom={this.swipeCardBottom}
        goBackToPreviousCardOnSwipeBottom={true}
        onSwiped={cardIndex => {
          this.setCurrentIndex(cardIndex);
        }}
        cardIndex={this.state.currentIndex}
        backgroundColor={'black'}
        infinite={true}></Swiper>
    );
  }

  

  setIsSwiping = (index, isSwipingBack) => {
    if (this.state.memeData.length === index + 1) {
      this.setState({
        noMoreContent: true,
      });
    } else {
      this.setState({
        currentIndex: this.state.currentIndex - 1,
      });
    }
  };

  // swipeCard = (index) => {

  //     this.swiper.swipeCard(() => {
  //       this.setIsSwiping(index, false)
  //     })

  // };

  // swipeCardBottom = (index) => {

  //     this.swiper.swipeBack();
  //     this.setState({
  //       currentIndex: this.state.currentIndex-2
  //     })

  // };

  

  render() {

    AdMobInterstitial.setAdUnitID('ca-app-pub-9423680607314008/6743597745');
    //AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
    AdMobInterstitial.requestAd().then(() => {(parseInt(this.state.currentIndex)%2)===0?AdMobInterstitial.showAd():null});
    return (
      <View style={{ flex: 1 }}>
        <Loader loading={this.state.loading} />
        {this.state.show || this.state.noMoreContent ? (
          <View
            style={{
              backgroundColor: 'white',
              height: 50,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => this.openDrawer()}
              style={{ marginLeft: '1%' }}>
              <Icon size={25} name={'dehaze'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.openDrawer()}
              style={{ marginLeft: '84%' }}>
              {
                // <Icon size={25} name={'toc'} />
              }
              <ModalDropdown
                dropdownStyle={{ width: 100, height: 110 }}
                dropdownTextStyle={{ color: 'black' }}
                defaultValue={'Hinglish'}
                defaultIndex={0}
                dropdownTextHighlightStyle={{ color: 'red' }}
                options={['Hinglish', 'English', 'Hindi']}
                onSelect={(index, value) => this.selectLanguage(value)}>
                <Icon size={25} name={'toc'} />
              </ModalDropdown>
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.noMoreContent ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon size={80} name={'insert-photo'} style={{ color: '#d3d3d3' }} />
            <Text style={{ fontSize: 30, textAlign: 'center', color: '#d3d3d3' }}>
              No More Memes
            </Text>
          </View>
        ) : (
            <View style={{ flex: 1 }}>
              {this.renderArticles(this.state.memeData)}
            </View>
          )}
        {this.state.show && !this.state.noMoreContent ? (
          <View
            style={{
              backgroundColor: 'white',
              height: 50,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.clickLike()}
              style={{ flexDirection: 'row' }}>
              <Icon
                size={25}
                name={'favorite-border'}
                style={{ color: this.getColor() }}
              />
              <Text style={{ fontSize: 16 }}>
                {this.state.memeData[this.state.currentIndex]
                  ? this.state.memeData[this.state.currentIndex].vote
                  : null}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.downloadImage()}>
              <Icon size={25} name={'file-download'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.convertToBase64(
                  'meme',
                  this.state.memeData[this.state.currentIndex].avatar,
                )
              }>
              <Icon size={25} name={'share'} />
            </TouchableOpacity>
          </View>
        ) : null}

        <AdMobBanner
          adSize="fullBanner"
          //adUnitID="ca-app-pub-3940256099942544/6300978111"
          adUnitID="ca-app-pub-9423680607314008/6944233712"
          onFailedToLoad={error => console.log('error in ads: ', error)}
        />

        {/* <PublisherBanner
          adSize="fullBanner"
          //adUnitID="ca-app-pub-3940256099942544/6300978111"
          adUnitID="ca-app-pub-9423680607314008/3225162743"
          onFailedToLoad={error => console.error(error)}
          onAppEvent={event => console.log(event.name, event.info)}
        /> */}

      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});
