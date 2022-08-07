import { fromBech32Address } from "@zilliqa-js/zilliqa";
import { BatchResponse } from "utils/batch";

export default async function getTokensFromCollectionsOwnerStates(walletAddress: string, responses: BatchResponse[]): Promise<{ [key: string]: string[] }> {
  let walletAddr = fromBech32Address(walletAddress).toLowerCase()

  var tokens: { [key: string]: string[] } = {}
  
  responses.forEach(response =>{
    if(response.result === null) {
      return
    }

    let tokenIds = Object.keys(response.result.token_owners).filter(tokenId => {
      return response.result.token_owners[tokenId] === walletAddr
    })

    if(tokenIds.length > 0){
      tokens[response.request.collection!.address] = tokenIds
    }
  })
  
  return tokens
}