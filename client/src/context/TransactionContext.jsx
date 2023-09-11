import React, { Children } from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract
}


export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''})
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value}))
    }

    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!')
            const transactionContract = getEthereumContract()

            const availableTransactions = await transactionContract.getAllTransactions()

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                adressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount)
            }))
            console.log(availableTransactions)
            setTransactions(structuredTransactions)
        } catch (error) {
            console.log(error)
        }
    }

    const checkIfWalletIsConnected = async () => {

        try {
            if(!ethereum) return alert('Please install metamask!')
    
            const accounts = await ethereum.request({method: 'eth_accounts'})
    
            if(accounts.length) {
                setCurrentAccount(accounts[0])
    
                getAllTransactions()  
            } else {
                console.log('no account found')
            }
            
    
            console.log(accounts)
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object.')
        }

    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract()
            const transactionCount = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)

            window.localStorage.setItem("TransactionCount", transactionCount)
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object')
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!')

            const accounts = await ethereum.request({method: 'eth_requestAccounts'})


            setCurrentAccount(accounts[0])

        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert('Please install metamask!')

            const {addressTo, amount, keyword, message} = formData
            const transactionContract = getEthereumContract()
            const parsedAmount = ethers.parseUnits(amount + '', 'ether');

            console.log('PARSED', parsedAmount)

            const transactionHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 GWEI
                    value: parsedAmount + '',
                }]
            })

            await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
            setIsLoading(true)

            console.log(`Loading => ${transactionHash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success => ${transactionHash}`)

            const transactionCount = await TransactionContract.getTransactionCount()

            setTransactionCount(transactionCount.toNumber())

        } catch (error) {
            console.log(error)

            throw new Error('No ethereum object.')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionsExist()
    }, [])


    return(<TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
        {children}
    </TransactionContext.Provider>)
}