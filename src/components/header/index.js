/** @jsx h */

import { h, Component } from 'preact'
import { route } from 'preact-router'
import Toolbar from 'preact-material-components/Toolbar'
import Drawer from 'preact-material-components/Drawer'
import List from 'preact-material-components/List'
import Dialog from 'preact-material-components/Dialog'
import Switch from 'preact-material-components/Switch'
// import style from './style';

export default class Header extends Component {
  closeDrawer () {
    this.drawer.MDComponent.open = false
    this.state = {
      darkThemeEnabled: false
    }
  }

  openDrawer = () => (this.drawer.MDComponent.open = true)

  openSettings = () => this.dialog.MDComponent.show()

  drawerRef = drawer => (this.drawer = drawer)
  dialogRef = dialog => (this.dialog = dialog)

  linkTo = path => () => {
    route(path)
    this.closeDrawer()
  }

  goHome = this.linkTo('/')
  goToMyProfile = this.linkTo('/profile')

  render () {
    return (
      <div>
        <Toolbar className='toolbar'>
          <Toolbar.Row>
            <Toolbar.Section align-start>
              <Toolbar.Icon menu onClick={this.openDrawer}>
                menu
              </Toolbar.Icon>
              <Toolbar.Title>Cyberpunk 2020</Toolbar.Title>
            </Toolbar.Section>
            <Toolbar.Section align-end onClick={this.openSettings}>
              <Toolbar.Icon>settings</Toolbar.Icon>
            </Toolbar.Section>
          </Toolbar.Row>
        </Toolbar>
        <Drawer.TemporaryDrawer ref={this.drawerRef}>
          <Drawer.TemporaryDrawerContent>
            <List>
              <List.LinkItem onClick={this.goHome}>
                <List.ItemIcon>home</List.ItemIcon>
                Home
              </List.LinkItem>
              <List.LinkItem onClick={this.goToMyProfile}>
                <List.ItemIcon>account_circle</List.ItemIcon>
                Profile
              </List.LinkItem>
            </List>
          </Drawer.TemporaryDrawerContent>
        </Drawer.TemporaryDrawer>
        <Dialog ref={this.dialogRef}>
          <Dialog.Header>Settings</Dialog.Header>
          <Dialog.Body>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterButton accept>okay</Dialog.FooterButton>
          </Dialog.Footer>
        </Dialog>
      </div>
    )
  }
}
