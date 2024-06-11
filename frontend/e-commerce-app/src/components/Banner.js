import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from '../css/Banner.module.css'

export default function Banner({ data }) {
  console.log(data);
  const { title, content, destination, label } = data;

  return (
    <Row>
      <Col className="p-5 text-center">
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.content}>{content}</p>
        <Link className="btn" id={styles.label} to={destination}>
          {label}
        </Link>
      </Col>
    </Row>
  );
}
