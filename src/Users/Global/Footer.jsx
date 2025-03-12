import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
import { ActionIcon, Container, Group, Text } from '@mantine/core';
import classes from './Footer.module.css';

// Footer link data
const data = [
  {
    title: 'About Us',
    links: [
      { label: 'Our Story', link: '#' },
      { label: 'Careers', link: '#' },
      { label: 'Privacy Policy', link: '#' },
      { label: 'Terms & Conditions', link: '#' },
    ],
  },
  {
    title: 'Events',
    links: [
      { label: 'Upcoming Events', link: '#' },
      { label: 'Request an Event', link: '#' },
      { label: 'Past Events', link: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', link: '#' },
      { label: 'Contact Us', link: '#' },
      { label: 'Help Center', link: '#' },
    ],
  },
  {
    title: 'Follow Us',
    links: [
      { label: 'Facebook', link: 'https://facebook.com' },
      { label: 'Instagram', link: 'https://instagram.com' },
      { label: 'Twitter', link: 'https://twitter.com' },
    ],
  },
];

const Footer = () => {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        target={link.link.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Text className={classes.websiteName} size="xl" fw={700}>
            TickEtopia
          </Text>
          <Text size="xs" c="dimmed" className={classes.description}>
            Discover and book the best events in town.
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © {new Date().getFullYear()} TickEtopia. All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}

export default Footer;
