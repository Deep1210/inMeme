import {Dimensions} from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;


export default {
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    navItemStyle: {
        alignItems:'center',
        padding: 10,
        paddingLeft: 10,
        fontSize: 16,
        flexDirection:'row'
    },
    header:{
        backgroundColor: "black",
        height:64,
       justifyContent:'center'
    },
    avatar: {
        width:130,
        height:130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:30
    },
    name:{
        fontSize:16,
        color:'white',
        marginLeft:'2%'
    },
    icon: {
        color:"#d4d4d4",
        marginLeft: 0,
        marginRight: 0,
        fontSize: 20
    },
    text:{
        paddingLeft:5
    },

    bodyContent: {
        alignItems: 'center',
        fontSize:20,
        
    },
   
    mainContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginLeft:10,
        marginRight:10,
        marginBottom:10
  },
  containerStyle: {
        height: 200,
        backgroundColor: 'white',
        borderWidth:0,
        marginBottom:2,
        marginLeft:5,
        marginRight:5,
        borderColor:'#808080',
        marginTop:10,
        elevation: 10,
        borderRadius:10,
        width: (SCREEN_WIDTH-40)/2,
        justifyContent:'center',
        alignItems:'center',
    }
};
  