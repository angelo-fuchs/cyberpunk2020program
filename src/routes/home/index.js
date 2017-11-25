/** @jsx h */

import { h, Component } from 'preact'
import {
  Card,
  LayoutGrid,
  Formfield,
  Textfield,
  Select
} from 'preact-material-components'
import style from './style'

const attributes = [
  'Body',
  'Ref',
  'Int',
  'Tech',
  'Luck',
  'Attr',
  'Cool',
  'Emp',
  'Move'
]

const Skill = ({ name, value, attribute}) => (
  <div>
    <div>
      <Textfield label='Name' value={name} type='text' />
    </div>
    <div>
      <Textfield label='Wert' value={value} type='number' />
    </div>
    <div>
      <Select
        style={{width: 100}}
        hintText='Select Attribute'>
        {attributes.map((attr) => (
          <Select.Item>
            {attr}
          </Select.Item>
        ))}
      </Select>
    </div>
  </div>
)

const Skills = () => (
  <LayoutGrid>
    <LayoutGrid.Inner>
      <LayoutGrid.Cell cols='6'>
        <Skill name='Gewehr' value={3} attribute='Body' />
      </LayoutGrid.Cell>
      <LayoutGrid.Cell cols='6'>

      </LayoutGrid.Cell>
    </LayoutGrid.Inner>
  </LayoutGrid>
)

const BaseAttr = ({ label, type = 'text' }) => (
  <LayoutGrid.Cell cols='6'>
    <Textfield
      label={label}
      type={type} />
  </LayoutGrid.Cell>
)

const Base = () => (
  <LayoutGrid>
    <LayoutGrid.Inner>
      <BaseAttr label='Handle' />
      <BaseAttr label='Alter' type='number'/>
    </LayoutGrid.Inner>
    <LayoutGrid.Inner>
      <BaseAttr label='Spieler' />
      <BaseAttr label='Geschlecht' />
    </LayoutGrid.Inner>
    <LayoutGrid.Inner>
      <BaseAttr label='Größe' type='number' />
      <BaseAttr label='Gewicht' type='number' />
    </LayoutGrid.Inner>
    <LayoutGrid.Inner>
      <BaseAttr label='Haar' />
      <BaseAttr label='Augen' />
    </LayoutGrid.Inner>
    <LayoutGrid.Inner>
      <BaseAttr label='Ruf' type='number' />
      <BaseAttr label='Offene CP' type='number' />
    </LayoutGrid.Inner>
    <LayoutGrid.Inner>
      <BaseAttr label='Stil' />
    </LayoutGrid.Inner>
  </LayoutGrid>
)

const Attributes = () => (
  <LayoutGrid>
    <LayoutGrid.Inner>
      {attributes.slice(0, 3).map((attr) => (
        <LayoutGrid.Cell cols='4' key={attr}>
          <Textfield
            label={attr}
            type='number' />
        </LayoutGrid.Cell>
      ))}
    </LayoutGrid.Inner>
    <LayoutGrid.Inner>
      {attributes.slice(3, 6).map((attr) => (
        <LayoutGrid.Cell cols='4' key={attr}>
          <Textfield
            label={attr}
            type='number' />
        </LayoutGrid.Cell>
      ))}
    </LayoutGrid.Inner>
    <LayoutGrid.Inner>
      {attributes.slice(6).map((attr) => (
        <LayoutGrid.Cell cols='4' key={attr}>
          <Textfield
            label={attr}
            type='number' />
        </LayoutGrid.Cell>
      ))}
    </LayoutGrid.Inner>
  </LayoutGrid>
)

export default class Home extends Component {
  render () {
    return (
      <div class={style.home}>
        <LayoutGrid>
          <LayoutGrid.Inner>
            <LayoutGrid.Cell cols='12'>
              <h1>Character Editor</h1>
            </LayoutGrid.Cell>
          </LayoutGrid.Inner>
          <LayoutGrid.Inner>
            <LayoutGrid.Cell cols='4'>
              <Card>
                <Card.Primary>
                  <Card.Title>Base</Card.Title>
                </Card.Primary>
                <Card.SupportingText>
                  <Base />
                </Card.SupportingText>
              </Card>
            </LayoutGrid.Cell>
            <LayoutGrid.Cell cols='8'>
              <Card>
                <Card.Primary>
                  <Card.Title>Attributes</Card.Title>
                </Card.Primary>
                <Card.SupportingText>
                  <Attributes />
                </Card.SupportingText>
              </Card>
              <Card>
                <Card.Primary>
                  <Card.Title>Fertigkeiten</Card.Title>
                </Card.Primary>
                <Card.SupportingText>
                  <Skills />
                </Card.SupportingText>
              </Card>
            </LayoutGrid.Cell>
          </LayoutGrid.Inner>
        </LayoutGrid>
      </div>
    )
  }
}
