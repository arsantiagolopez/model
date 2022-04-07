import Stripe from "stripe";

export interface UserEntity {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  emailVerified: Date;
  image: string;
  isMember: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

export interface UserProfileEntity {
  id: string;
  name?: string;
  lastName: string;
  firstName: string;
  image?: string;
  billingAddress?: Stripe.Address;
  paymentMethod?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
  userId: string;
}

export interface PostEntity {
  _id: string;
  platformId: string;
  platform: string;
  image: string;
  username: string;
  message: string;
  messageHtml?: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  link: string;
  isHidden: boolean;
}
