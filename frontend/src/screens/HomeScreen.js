import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import { listProducts } from '../actions/productActions'


const HomeScreen = ({ match }) => {
    const keyword = match.params.keyword

    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    const { loading, products, error, page, pages } = useSelector((state) => state.productList)

    useEffect(() => {

        dispatch(listProducts(keyword, pageNumber))

    }, [dispatch, keyword, pageNumber])


    return (
        <>
            <Helmet>
                <title>Welcome To ProShop | Home</title>
                <meta name='desctription' content='We sell the best products for cheap' />
                <meta name='keywords' content='electronics, buy electronics, cheap electronics' />
            </Helmet>
            {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>GO BACK</Link>}
            <h1>Latest Products</h1>
            {loading ? <Loader /> :
                error ? <Message variant='danger'>{error}</Message> :
                    <>
                        <Row>
                            {products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                    </>
            }

        </>
    )
}

export default HomeScreen
