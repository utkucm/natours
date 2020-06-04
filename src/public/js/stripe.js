/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alert';

const stripe = Stripe('pk_test_Eyll0vw8VLPKQqDmc8Km1CGv00YoJ7dFdF');

export const bookTour = async (tourId) => {
  try {
    // 1) Get session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
