import { useState, useEffect } from "react";
import { Row, Col, Card, Spin, Form, Input, Button, Image } from 'antd';
import Meta from "antd/es/card/Meta";
import { showNotification } from "./components/general/notification";


const App = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    setLoading(true)
    handleGetData(values.search)
  };

  const onFinishFailed = (errorInfo: any) => {
    showNotification("error", "Hata", "Formda hatalı alanlar mevcut", null)
  };

  const apikey = "3c67b397"

  const handleGetData = (str: string) => {
    fetch("http://www.omdbapi.com/?s=" + str + "&apikey=" + apikey, {
      method: "GET",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        const tempArr = data.Search.map((movie: any) => {
          return {
            name: movie.Title,
            year: movie.Year,
            key: movie.imdbID,
            image: movie.Poster
          }
        })
        setData(tempArr)
        setLoading(false)
      }).catch(() => {
        showNotification("error", "Hata", "Sonuç Bulunamadı Tekrar Deneyin", null)
        setLoading(false)
      })
  }


  useEffect(() => {
    handleGetData("the%20fault")
  }, [])



  return (<Spin spinning={loading}>
    <Row>
      <Col style={{ marginBottom: 25 }} sm={{ offset: 9, span: 6 }} xs={{ offset: 2, span: 20 }}>
        <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Row>
            <Col sm={16}>
              <Form.Item
                name="search"
                rules={[
                  { required: true, message: 'Please input your search!' },
                ]}
              >
                <Input
                  maxLength={40}
                  showCount
                  placeholder="Search Movie"
                />
              </Form.Item>
            </Col>
            <Col sm={8}>

              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    block
                    type="dashed"
                    htmlType="submit"
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                  >
                    Search
                  </Button>
                )}
              </Form.Item>
            </Col>

          </Row>

        </Form>
      </Col>
      <Col sm={{ offset: 9, span: 6 }} xs={{ offset: 2, span: 20 }}>
        {data.map((obj: any, index) => {
          return (
            <Card
              style={{ marginBottom: 10 }}
              key={index}
              hoverable
              cover={<Image alt="example" src={obj.image} />}
            >
              <Meta title={obj.name} description={obj.year} />
            </Card>
          )
        })}

      </Col>
    </Row>
  </Spin>
  )
}


export default App;