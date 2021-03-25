import { callableAddress, zilliqa } from "./zilliqa"

export default async function getSmartContractSubState(
  address: string, 
  variableName: string, 
  indices: string[] = []) {
    const checksumAddress = callableAddress(address)
    const state = await zilliqa.blockchain.getSmartContractSubState(checksumAddress, variableName, indices).catch(error => {
      console.log(error)
      return null
    })
    return state
}