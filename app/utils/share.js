import Share from 'react-native-share';

const OnShare = {
  share: function(title, url) {
    const shareOptions = {
      title: 'Share via',
      message:
        'Check out Inmeme app. I found it best for watching current memes, indian memes and  jokes.\n\n' +
        'https://play.google.com/store/apps/details?id=com.inmemes',
      url: 'data:image/png;base64' + url,
    };
    Share.open(shareOptions);
  },
  shareWithoutLink: function(title, url) {
    const shareOptions = {
      title: 'Share via',
      message: title,
      url: 'data:image/png;base64' + url,
      failOnCancel: true,
    };
    Share.open(shareOptions);
  },
};

export default OnShare;
