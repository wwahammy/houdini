// License: LGPL-3.0-or-later
import grecaptchaPromised  from '../../../javascripts/src/lib/grecaptcha_during_payment';
import 'whatwg-fetch';
declare const stripeV3:stripe.Stripe

// we add CSRF to the window type
const windowWithCSRF: Window & {_csrf:string} = window as any; 

interface ValidatedFormData extends Map<string, any> {
  name?:string
  address_zip?:string,
  path:string
}

type Result = {'token':any};

interface Props {
  validFormData: ValidatedFormData
  cardObject: stripe.elements.Element
  path: string
  payload: any
}

type RecaptchaSuccessResult = {recaptcha_token:any, stripe_resp: any}
type RecaptchaError = {message:string}


function didRecaptchaError(input: RecaptchaSuccessResult|RecaptchaError):  input is RecaptchaError {
  return input.hasOwnProperty('message')
}

async function throwableStripeRespToGRecaptcha<T>(resp:T) : Promise<RecaptchaSuccessResult> {
  const result = await grecaptchaPromised(resp)

  if (didRecaptchaError(result)){
    throw new Error(result.message)
  }
  return result;

}

async function createTokenFromStripe(props:{validFormData:ValidatedFormData, cardObject: stripe.elements.Element}): Promise<stripe.Token> {
  if (props.validFormData.address_zip)
  {
    props.cardObject.update({value: {postalCode: props.validFormData.address_zip}})
  }
  
  const response = await stripeV3.createToken(props.cardObject, {name:props.validFormData.name})
  if (response.error) {
    throw new Error(response.error.message);
  }
  return response.token;
}

type SaveCardError = {error:any}

function HasAnSaveCardError(obj:any) : obj is SaveCardError {
  return obj.hasOwnProperty('error');
}

interface SaveCardProps  {
  sendData: Map<string,any> & {card:any}
  path:string
  stripe_resp:stripe.Token
  recaptcha_token:string
  cardholder_name: string|null
}

async function saveCard(props:SaveCardProps) : Promise<Result> {

  const send = {
    ...props.sendData,
    'g-recaptcha-response': props.recaptcha_token,
    card: {
      ...props.sendData.card, 
      cardholders_name: props.cardholder_name,
     name: `${props.stripe_resp.card.brand} *${props.stripe_resp.card.last4}`,
     stripe_card_token: props.stripe_resp.id,
     stripe_card_id: props.stripe_resp.card.id,
    }
  }

  
    const response = await fetch(props.path, {
      method: 'POST',
      body: JSON.stringify(send),
      headers:new Headers({
        'Content-Type': 'application/json',
        'X-CSRF-Token': windowWithCSRF._csrf
      }),
      credentials: 'include'
    })

    if (response.ok && 
      response.status >= 200 && 
      response.status < 300)
      {
        const json = await response.json<SaveCardError|Result>();
        if (HasAnSaveCardError(json))
        {
          throw new Error(json.error.toString());
        }

        return json;
      }
    else {
      throw new Error('Response was invalid');
    }
}




export default async function SaveCard(props:Props) : Promise<Result> {
  const tokenResult = await createTokenFromStripe(props);
  const recaptchaResult = await throwableStripeRespToGRecaptcha(tokenResult);
  const saveCardResult = await saveCard({
    path: props.path,
    recaptcha_token: recaptchaResult.recaptcha_token,
    stripe_resp: recaptchaResult.stripe_resp,
    sendData: props.payload,
    cardholder_name: props.validFormData.name
  })

  return saveCardResult;
  
}

