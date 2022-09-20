
import {SafeAreaView} from 'react-native-safe-area-context';
import { Background } from '../../components/Background';
import { useRoute, useNavigation} from '@react-navigation/native';

import { THEME } from '../../theme';
import { styles } from './styles';

import { GameParams } from '../../@types/navigation';
import {Image,View,TouchableOpacity, FlatList,Text} from 'react-native';
import {Entypo} from '@expo/vector-icons';

import logoImg from '../../assets/logo-nlw-esports.png'
import { Heading } from '../../components/Heading';
import React, { useEffect, useState } from 'react';
import { DuoCard, DuoCardPros } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';


export function Game() {

  const [duos, setDuos] = useState<DuoCardPros[]>([]);
  const [discordDuoSelected,setDiscordDuoSelected] = useState('')
  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoback(){
      navigation.goBack();
  }

  async function getDiscordUser(adsId:string) {
    fetch(`http://192.168.0.103:3333/ads/${adsId}/discord`)
      .then(response =>response.json())
         .then(data => setDiscordDuoSelected(data.discord));
  }

  useEffect(()=>{
    fetch(`http://192.168.0.103:3333/games/${game.id}/ads`)
      .then(response =>response.json())
         .then(data =>{
            setDuos(data)
          });
 },[]);
 

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoback}>
            <Entypo name="chevron-thin-left" color={THEME.COLORS.CAPTION_300} size={20} />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo}/>
          <View style={styles.right} />

        </View>

        <Image  source={{uri: game.bannerUrl}} style={styles.cover} resizeMode="cover"/>
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!"/>
        <FlatList 
              data={duos} keyExtractor={item => item.id} 
              renderItem={({item}) =>(
                <DuoCard  
                    data={item} onConnect={() => getDiscordUser(item.id)}
                />
              )}      
              horizontal 
              style={styles.containerList}
              contentContainerStyle={[ duos.length > 0  ? styles.contentList : styles.emptyListContent]}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() =>(
                  <Text style={styles.emptyListText}>
                    Não há anuncios publicados ainda.
                  </Text>
              )}
        />
        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
    
  );
}