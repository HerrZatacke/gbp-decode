import {COMMAND} from "./constants";
import harmonizePalette from "./harmonizePalette";
import {ParsedPacket, PrintPacket} from "./Types";

const harmonizePalettes = (packets: (PrintPacket | ParsedPacket)[]): (PrintPacket | ParsedPacket)[] => {
  let unharmonizedPackets: ParsedPacket[] = [];

  return packets
    .map((packet: PrintPacket | ParsedPacket): PrintPacket|ParsedPacket => {
      switch (packet.command) {
        case COMMAND.DATA:
          unharmonizedPackets.push(packet as ParsedPacket);
          break;

        case COMMAND.PRINT:
          if ((packet as PrintPacket).data.palette === 0) {
            unharmonizedPackets = [];
            break;
          }

          while (unharmonizedPackets.length) {
            let unharmonizedPacket = unharmonizedPackets.shift();
            const data = [];

            if (!unharmonizedPacket) {
              throw Error('error harmonizing')
            }

            for (let i = 0; i < unharmonizedPacket.data.length; i += 2) {
              data.push(
                ...harmonizePalette(
                  unharmonizedPacket.data[i],
                  unharmonizedPacket.data[i + 1],
                  (packet as PrintPacket).data.paletteData,
                ),
              );
            }

            Object.assign(unharmonizedPacket, { data });
          }
          break;

      }

      return packet;
    })
};

export default harmonizePalettes;
