import * as React from 'react';
import { observer } from 'mobx-react-lite';

import store from '../../../store';
import { icons } from '~/renderer/constants';
import { IFormFillData } from '~/interfaces';
import { Section, onMoreClick } from '../Section';
import {
  Container,
  HeaderLabel,
  Wrapper,
  Icon,
  Label,
  PasswordIcon,
  More,
} from './styles';

const passwords: Map<string, string> = new Map();

const getUserPassword = async (data: IFormFillData) => {
  const { url, fields } = data;
  const account = `${url}-${fields.username}`;
  const password = passwords.get(account);

  if (password) return password;

  // TODO(xnerhu): node-keytar in web
  // const realPassword = await getPassword('wexond', account);

  // passwords.set(account, realPassword);
  // return realPassword;
  return '';
};

const Item = ({ data }: { data: IFormFillData }) => {
  const { url, favicon, fields } = data;
  const [realPassword, setRealPassword] = React.useState<string>(null);

  const password = realPassword || '•'.repeat(fields.passLength);

  const onIconClick = async () => {
    const pass = !realPassword && (await getUserPassword(data));
    setRealPassword(pass);
  };

  // TODO(xnerhu): favicons

  return (
    <>
      <Wrapper>
        {/* <Icon icon={store.favicons.favicons.get(favicon)} /> */}
        <Label style={{ marginLeft: 12 }}>{url}</Label>
      </Wrapper>
      <Wrapper>
        <Label>{fields.username}</Label>
      </Wrapper>
      <Wrapper>
        <Label>{password}</Label>
        <PasswordIcon toggled={!!realPassword} onClick={onIconClick} />
        <More onClick={onMoreClick(data)} />
      </Wrapper>
    </>
  );
};

export const Passwords = observer(() => {
  return (
    <Section label="Passwords" icon={icons.key}>
      <Container>
        <HeaderLabel>Website</HeaderLabel>
        <HeaderLabel>Username</HeaderLabel>
        <HeaderLabel>Password</HeaderLabel>
        {store.autoFill.credentials.map(item => (
          <Item key={item._id} data={item} />
        ))}
      </Container>
    </Section>
  );
});
