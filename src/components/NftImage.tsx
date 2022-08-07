import { fromBech32Address } from "@zilliqa-js/zilliqa"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { BlockchainState, NftCollection, NftToken, RootState } from "store/types"

interface Props {
  collection: NftCollection
  token: NftToken
}

const NftImage = (props: Props) => {
  const { collection, token } = props
  const [image, setImage] = React.useState<string | undefined>(undefined)
  const blockchainState = useSelector<RootState, BlockchainState>(state => state.blockchain)
  const client = blockchainState.client

  useEffect(() => {
    if(token.image) {
      setImage(token.image)
    } else {
      fetchImage()
    }
  }, [])

  async function fetchImage() {
    if(collection.base_uri !== "") {
      // NFT collection has a base uri
      try {
        const response = await fetch(`${collection.base_uri}${token.id}`)
        const metadata = await response.json()
        
        if(metadata.hasOwnProperty("image")) {
          setImage(metadata.image)
        }
      } catch(err) {
        console.log(err)
      }
    } else {
      // Has no base uri so likely have to fetch token_uri first.
      const response = await client.blockchain.getSmartContractSubState(
        fromBech32Address(collection.address),
        'token_uris',
        [token.id]
      )
      setImage(response.result.token_uris[token.id])
    }
  }

  return (
    <img className="z-10" src={image} loading="lazy" />
  )
}

export default NftImage