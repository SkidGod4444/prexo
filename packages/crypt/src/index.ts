interface EncryptedData {
  initialVector: string;
  encrypted: string;
}

function encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function decode(buffer: Uint8Array): string {
  return new TextDecoder().decode(buffer);
}

export async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return new Uint8Array(derivedBits);
}

export async function encrypt(
  text: string,
  key: Uint8Array,
): Promise<EncryptedData> {
  if (key.length !== 32) {
    throw new Error("Key must be 32 bytes long for AES-256-GCM encryption");
  }

  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-GCM" },
      false,
      ["encrypt"],
    );

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      cryptoKey,
      encode(text),
    );

    return {
      initialVector: Buffer.from(iv).toString("hex"),
      encrypted: Buffer.from(encryptedData).toString("hex"),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Encryption failed: " + error.message);
    } else {
      throw new Error("Encryption failed: unknown error");
    }
  }
}

export async function decrypt(
  encryptedData: EncryptedData,
  key: Uint8Array,
): Promise<string> {
  if (key.length !== 32) {
    throw new Error("Key must be 32 bytes long for AES-256-GCM decryption");
  }

  try {
    const iv = Buffer.from(encryptedData.initialVector, "hex");
    const encryptedBuffer = Buffer.from(encryptedData.encrypted, "hex");

    const cyptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    );

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      cyptoKey,
      encryptedBuffer,
    );

    return decode(new Uint8Array(decryptedData));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Decryption failed: " + error.message);
    } else {
      throw new Error("Decryption failed: unknown error");
    }
  }
}
