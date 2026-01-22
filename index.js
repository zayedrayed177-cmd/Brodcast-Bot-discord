const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Bot Online'));
app.listen(PORT, () => console.log(`Server on ${PORT}`));

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ]
});

client.once('ready', () => {
  console.log(`${client.user.username} is Online`);
  client.user.setActivity('Broadcast Bot By TFA7A', { type: 0 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!bc')) return;

  if (!message.member.permissions.has('Administrator')) return message.delete();
  if (message.channel.id !== process.env.ch) return;

  const args = message.content.slice(3).trim();
  if (!args) return;

  let count = 0;
  message.guild.members.cache.forEach(m => {
    if (!m.user.bot) {
      m.send(args).then(() => count++).catch(() => {});
    }
  });

  message.delete();

  const embed = new EmbedBuilder()
    .setTitle('Broadcast Sent')
    .setColor('Blue')
    .addFields(
      { name: 'Message', value: `\`\`\`${args}\`\`\`` },
      { name: 'Users', value: `${count}` }
    );

  message.channel.send({ embeds: [embed] }).then(m =>
    setTimeout(() => m.delete().catch(() => {}), 8000)
  );
});

client.login(process.env.token);
