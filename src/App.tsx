import { useState, useEffect } from "react";
import { Row, Col, Image, Progress, Divider, Button } from 'antd';
import { data } from "./staticData/cards"
import useWindowSize from "./hooks/useWindowSize";

const App = () => {
  const [gameData, setGameData] = useState<any>([])
  const [result, setResult] = useState<number>(0)
  const [bugIndex, setBugIndex] = useState<number>(0)
  const [bugID, setBugID] = useState<number>(0)

  const size = useWindowSize()


  const shuffle = (array: any) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;

  }


  const handleBugFix = () => {
    handleCard(bugIndex, bugID)
  }

  const handleCard = (index: number, id: number) => {
    const tempArr = [...gameData]
    setBugIndex(index)
    setBugID(id)

    if (tempArr[index].isStatic) return


    let flag1: number = 0;
    let flag2: number = 0;


    tempArr.map((obj) => {
      if (obj.id === id && obj.isShow) flag1++
      if (obj.isShow && !obj.isStatic) flag2++
    })
    if (flag1 === 2) {
      tempArr.map((obj) => {
        if (flag1 === 2 && obj.id === id) {
          obj.isShow = true
          obj.isStatic = true
        }
      })
      setGameData(tempArr)

    } else if (flag2 === 2) {
      tempArr.map((obj) => {
        if (!obj.isStatic) obj.isShow = false
      })
      setGameData(tempArr)

    } else {
      tempArr[index].isShow = !tempArr[index].isShow

      setGameData(tempArr)
    }


    handleResult(tempArr)
  }

  const handleResult = (arr: any) => {
    let counter: number = 0
    const tempArr = [...arr]
    tempArr.map((obj) => obj.isStatic && counter++)

    setResult(counter / 2 * 100 / 8)
  }

  useEffect(() => {
    const tempArr = shuffle(data)
    setGameData(tempArr)
  }, [])



  return (
    <Row >
      <Col xs={{ span: 4, offset: 10 }}>
        <Progress type="circle" strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} percent={result} size={"small"} />
        <Button size="small" onClick={() => handleBugFix()}>Match</Button>

      </Col>

      <Divider />
      {gameData.map((obj: any, index: number) => {
        return (
          <Col onClick={() => handleCard(index, obj.id)} key={index} xs={5} style={{ margin: 5 }}  >
            <Image width={size.width < 1000 ? size.width / 6 : size.width / 12} height={size.width < 1000 ? size.width / 6 : size.width / 12} preview={false} src={obj.isShow ? obj.src : "./cover.png"} />
          </Col>
        )
      })}

    </Row>
  )
}


export default App;