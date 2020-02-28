import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, Modal, TextInput, TouchableOpacity, FlatList, AsyncStorage, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import pic from './assets/images/human.png';

export default class App extends Component {
  
  state = {
    fontLoaded: false,
    modalVisible: false,
    newWaterTarget: 3.5,
    totalDrunkWater: 0.5,
    data: [
      {
        id: "item-1",
        value: '',
        ml: ''
      },
      {
        id: "item-2",
        value: 150,
        ml: 'ml'
      },
      {
        id: "item-3",
        value: 250,
        ml: 'ml'
      },
      {
        id: "item-4",
        value: 350,
        ml: 'ml'
      },
      {
        id: "item-5",
        value: 450,
        ml: 'ml'
      },
      {
        id: "item-6",
        value: '',
        ml: ''
      }
    ],
    isSelected: false,
    selectedNumber: null,
    selectedItemValue: 0,
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });

    this.getDataStorage();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setDataStorage = async () => {
    try {
      let newWaterTarget = this.state.newWaterTarget;
      await AsyncStorage.setItem('newWaterTarget', JSON.stringify(newWaterTarget));
      console.log("Data saved!")
    } catch (error) {
      console.log("Saving data error");
    }
  };

  getDataStorage = async () => {
    try {
      let newWaterTarget = await AsyncStorage.getItem('newWaterTarget');
        if (newWaterTarget === null) {
          newWaterTarget = this.newWaterTarget;
          await AsyncStorage.setItem('newWaterTarget', JSON.stringify(newWaterTarget));
          this.setState({ newWaterTarget: newWaterTarget });
          return;
        }
        newWaterTarget = JSON.parse(newWaterTarget);
        this.setState({ newWaterTarget: newWaterTarget });
        console.log("Data get from AsyncStorage succesfully!");
    } catch (error) {
      console.log("Read data error");
    }
  };

  onInputTextChanged = (value) => {
    this.setState({
			newWaterTarget: (value.replace(/[^0-9]/g, ''))/1000
		});
  }

  onSubmit = async (newWaterTarget) => {
    await this.setDataStorage();
    this.setState({
      newWaterTarget,
      modalVisible: false
    });
  }

  selectedItem = (selectedNumber, item) => { 
   let newSelectedItemValue = item.value;
  
    this.setState({
      selectedNumber,
      selectedItemValue: newSelectedItemValue,
    });
  }

  decrement = () => {
    this.setState({ 
      totalDrunkWater: parseFloat((this.state.totalDrunkWater - this.state.selectedItemValue/1000).toFixed(2)) 
    })
  }

  increment = () => {
    this.setState({ 
      totalDrunkWater: parseFloat((this.state.totalDrunkWater + this.state.selectedItemValue/1000).toFixed(2)) 
    })
  }

  render() {
    const { data, totalDrunkWater, newWaterTarget, isSelected, activeStyle, selectedNumber } = this.state;

    let waterFilling = 100 - ((totalDrunkWater/newWaterTarget)*100);

    if ( waterFilling < 0 ) {
      waterFilling = 0
    }
    
    return (
      <View style={styles.container}>
        {
          this.state.fontLoaded && 
            
          <View>

            <View style={styles.topRow}>
              <View style={styles.col}>
                <Text style={styles.textBig}>{totalDrunkWater} L</Text>
                <Text style={styles.text}>Total water drunk</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.textBig}>15</Text>
                <Text style={styles.text}>Achieved goal days</Text>
              </View>
            </View>
            
            <View style={styles.imageBox}>
              <View style={{ position: "relative", padding: 5}}>
                <View style={{position: "relative"}}>
                  <Image source={pic} style={{width: 136, height: 320}}/>
                  <View 
                    style={{ 
                      position: "absolute", 
                      top: `${waterFilling}%`,
                      bottom: 0,
                      right: 0,
                      left: 0,
                      marginTop: 6,
                      backgroundColor: "rgba(8, 142, 207, .7)"
                    }}></View>
                </View>
                
                <View style={styles.editContainer}>
                  <View style={styles.editBox}>
                    <View style={styles.line}>
                      <Text style={{ width: 83}}></Text>
                    </View>
                    <View>
                      <Text style={styles.editBoxText}>
                        {newWaterTarget} L
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={{marginLeft: -10}}
                        onPress={() => {
                          this.setModalVisible(true);
                        }}
                      >
                        <Icon
                          reverse
                          name='md-create'
                          type='ionicon'
                          color='#53BFEF'
                          size='18'
                        />
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              </View>
              <Text style={styles.textMedium}>Nice work! Keep it up!</Text>
            </View>

            {/* Slider */}
            <View>
              <View style={styles.sliderContainer}>
                <FlatList
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                  data={data}
                  renderItem={({ item }) => {
                    const isSelected = (this.state.selectedNumber === item.id);
                    const activeStyle = isSelected ? styles.sliderItemTextActive : styles.sliderItemText;
                    return (
                      <TouchableOpacity
                        underlayColor={"#fff"}
                      >
                          <Text
                            onPress={() => this.selectedItem(item.id, item)}
                            style={activeStyle}
                          >
                            {item.value} {item.ml}
                          </Text>
                      </TouchableOpacity>
                    )
                  }}
                  keyExtractor={item => item.id}
                  pagingEnabled={Platform.OS === 'android'}
                  scrollEnabled={true}
                  decelerationRate={0}
                  snapToAlignment='center'
                  snapToInterval={200}
                />
              </View>

              <View style={styles.plusMinusButtons}>
                <TouchableOpacity
                  title="decrease"
                  onPress={() => this.decrement()}
                >
                  <Icon
                    reverse
                    name='ios-remove-circle-outline'
                    md='md-remove-circle'
                    type='ionicon'
                    color='#53BFEF'
                    size='60'
                  />
                </TouchableOpacity>
              
                <TouchableOpacity
                  title="increase"
                  onPress={() => this.increment()}
                >
                  <Icon
                    reverse
                    name='ios-add-circle-outline'
                    md='md-add-circle'
                    type='ionicon'
                    color='#53BFEF'
                    size='60'
                  />
                </TouchableOpacity>
              </View>
            </View>
          
            {/* Modal Box */}
            <Modal
              style={styles.modalBox}
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalContentBody}>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    color={'#fff'}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.modalCloseButtonText}>&times;</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.modalTitle}>Update Target Water</Text>
                  <Text style={styles.modalText}>Please enter you new water target below</Text>
                  
                  <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = {"ml"}
                    placeholderTextColor = "#53BFEF"
                    keyboardType = "numeric"
                    onChangeText={value => this.onInputTextChanged(value)}
                    value = {newWaterTarget}
                  />
                  <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {
                      () => this.onSubmit(newWaterTarget)
                   }>
                    <Text style = {styles.submitButtonText}>UPDATE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </View>
        }
      </View>
    )   
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#53bfef',
    justifyContent: "center",
    padding: 15,
  },

  topRow: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: "center",
    justifyContent: 'space-between',
    alignItems: "center",
  },

  col: {
    width: 130,
    textAlign: "center"
  },

  textBig: {
    color: "#fff",
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
    textAlign: "center",
    marginTop: 40
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 10,
  },

  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 40,
    width: "100%"
  },

  editContainer: {
    position: "absolute",
    top: -15,
    left: 65,
  },

  editBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    right: 0
  },

  line: {
    width: 83, 
    height: 1, 
    borderColor: "#088ECF",  
    borderStyle: 'dashed', 
    borderWidth: .7, 
    marginTop: 0, 
    marginRight: 5
  },

  editBoxText: {
    color: "#fff",
    fontFamily: "Roboto-Medium",
    fontSize: 22
  },

  // Modal Box
  modalBox: {
    padding: 5
  },

  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContentBody: {
    position: "relative",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    color: "#53bfef",
    borderRadius: 8,
    padding: 0,
    height: 280,
    width: 270
  },

  modalCloseButton: {
    position: "absolute",
    top: 0,
    right: 3,
    width: 28,
    height: 28,
  },

  modalCloseButtonText: {
    color: "#53bfef",
    fontSize: 26,
    fontWeight: "bold",
    padding: 3
  },

  modalTitle: {
    color: "#53bfef",
    fontFamily: "Roboto-Bold",
    fontSize: 22,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center"
  },

  modalText: {
    width: 200,
    color: "#53bfef",
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    marginBottom: 30,
    textAlign: "center"
  },

  input: {
    marginBottom: 15,
    padding: 5,
    height: 40,
    width: 200,
    borderColor: "#53BFEF",
    borderWidth: 1,
    borderRadius: 8,
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    textAlign: "center"
  },

  submitButton: {
    backgroundColor: "#53BFEF",
    padding: 10,
    marginBottom: 10,
    height: 40,
    width: 200,
    borderRadius: 8,
    
  },

  submitButtonText:{
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto-Bold",
    fontSize: 18
  },

  textMedium: {
    color: "#fff",
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    width: 150
  },

  // Slider
  sliderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  sliderItemText: {
    width: 128,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 22,
    paddingLeft: 22,
    fontFamily: "Roboto-Bold",
    fontSize: 26,
    color: "#fff",
    backgroundColor: "#53BFEF",
    opacity: .5
  },

  sliderItemTextActive: {
    width: 128,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 22,
    paddingLeft: 22,
    fontFamily: "Roboto-Bold",
    fontSize: 26,
    color: "#fff",
    backgroundColor: "#53BFEF",
    opacity: 1,
  },

  plusMinusButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

});
