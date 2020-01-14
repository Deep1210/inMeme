import {PermissionsAndroid, Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const Download = {
    permission:function(){
        try {
            const granted = PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                'title': 'InMeme Storage Permission',
                'message': 'This App needs access to your storage to download Photos.'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              return true;
            }
            else {
              return false;
            }
          } catch (err) {
            console.warn(err)
          }
    },
    start:function(url){
        var date = new Date();
        var image_URL = url;
        /*getExtention = (filename) => {
            return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
              undefined;
          }*/
        var ext = (/[.]/.exec(image_URL)) ? /[^.]+$/.exec(image_URL):undefined;
        ext = "." + ext[0];
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: PictureDir + "/image_" + Math.floor(date.getTime()
              + date.getSeconds() / 2) + ext,
            description: 'Image'
          }
        }
        config(options).fetch('GET', image_URL).then((res) => {
          Alert.alert("Image Downloaded Successfully.");
        });
    }
}

export default Download;