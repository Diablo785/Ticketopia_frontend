import React from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Box, Center, Group, PasswordInput, Progress, Text } from '@mantine/core';
import { useInputState } from '@mantine/hooks';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 7 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export function PasswordStrength({ password = '', setPassword }) {
    const strength = getStrength(password); // Use password which is guaranteed to be a string
    const checks = requirements.map((requirement, index) => (
      <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
    ));
    const bars = Array(4)
      .fill(0)
      .map((_, index) => (
        <Progress
          styles={{ section: { transitionDuration: '0ms' } }}
          value={
            password.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
          }
          color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
          key={index}
          size={4}
        />
      ));
  
    return (
      <div>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Your password"
          label="Password"
        />
  
        <Group gap={5} grow mt="xs" mb="md">
          {bars}
        </Group>
  
        <PasswordRequirement label="Has at least 8 characters" meets={password.length > 7} />
        {checks}
      </div>
    );
  }