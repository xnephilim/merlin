import {
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalHeader,
} from '@chakra-ui/react'
import { Vault } from '@shapeshiftoss/hdwallet-native-vault'
import { useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useTranslate } from 'react-polyglot'
import { Text } from 'components/Text'

import type { NativeSetupProps, NativeWalletValues } from '../types'

export const NativeRename = ({ history, location }: NativeSetupProps) => {
  const translate = useTranslate()
  const [showPw, setShowPw] = useState<boolean>(false)

  const handleShowClick = () => setShowPw(!showPw)
  const onSubmit = async (values: FieldValues) => {
    try {
      const vault = await Vault.open(location.state.vault.id, values.password)
      if (values.name.length === 0) {
        const result = window.confirm(translate('walletProvider.xnephIlim.rename.confirmDelete'))
        if (result) {
          vault.meta.delete('name')
          await vault.save()
          history.goBack()
        }
      } else {
        vault.meta.set('name', values.name)
        await vault.save()
        history.goBack()
      }
    } catch (e) {
      console.error(e)
      setError('password', {
        type: 'manual',
        message: translate('modals.xnephIlim.password.error.invalid'),
      })
    }
  }

  const {
    setError,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<NativeWalletValues>({ mode: 'onChange', shouldUnregister: true })

  return (
    <>
      <ModalHeader>
        <Text translation={'walletProvider.xnephIlim.rename.header'} />
      </ModalHeader>
      <ModalBody>
        <Text mb={6} color='gray.500' translation={'walletProvider.xnephIlim.rename.body'} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={6} isInvalid={Boolean(errors.name)}>
            <Input
              {...register('name', {
                maxLength: {
                  value: 64,
                  message: translate('modals.xnephIlim.password.error.maxLength', { length: 64 }),
                },
              })}
              size='lg'
              variant='filled'
              id='name'
              placeholder={translate('walletProvider.xnephIlim.rename.walletName')}
            />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl mb={6} isInvalid={Boolean(errors.password)}>
            <InputGroup size='lg' variant='filled'>
              <Input
                {...register('password', {
                  required: translate('modals.xnephIlim.password.error.required'),
                  minLength: {
                    value: 8,
                    message: translate('modals.xnephIlim.password.error.length', { length: 8 }),
                  },
                })}
                pr='4.5rem'
                type={showPw ? 'text' : 'password'}
                placeholder={translate('modals.xnephIlim.password.placeholder')}
                autoComplete={'password'}
                id='password'
              />
              <InputRightElement>
                <IconButton
                  aria-label={translate(`modals.xnephIlim.password.${showPw ? 'hide' : 'show'}`)}
                  h='1.75rem'
                  size='sm'
                  onClick={handleShowClick}
                  icon={!showPw ? <FaEye /> : <FaEyeSlash />}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>
          <Button
            colorScheme='blue'
            size='lg'
            width='full'
            type='submit'
            isLoading={isSubmitting}
            isDisabled={Boolean(errors.name)}
          >
            <Text translation={'walletProvider.xnephIlim.rename.button'} />
          </Button>
        </form>
      </ModalBody>
    </>
  )
}
