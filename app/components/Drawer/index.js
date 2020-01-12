import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';

export default class DrawerMenu extends Component {
    render() {
        return (
            <View style={{flex:1}}>
                <FlatList
                    data={[{ title: 'abc' }, { title: 'njj' }, { title: 'hdf' }, { title: 'bvb' }]}
                    renderItem={({item, index}) => {
                        <View>
                            <Text>{item.title}</Text>
                            {console.log('item',item.title)}
                        </View>
                    }}
                />
            </View>)
    }
}