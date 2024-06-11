// UserView.js
import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

const UserView = ({ products, onAddToCartClick }) => {
  return (
    <Row>
      {products.map(product => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
          <Card className="my-3 p-3 rounded">
            <Card.Img src={product.imageUrl} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text as="div">
                <div className="my-3">
                  {product.description}
                </div>
              </Card.Text>
              <Card.Text as="h3">${product.price}</Card.Text>
              <Button onClick={() => onAddToCartClick(product._id)}>
                Add to Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default UserView;
