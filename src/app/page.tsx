"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowDown,
  ArrowUp,
  AsteriskSquare,
  Hash,
  LucideIcon,
  Mail,
  MoveDown,
  MoveUp,
  PartyPopper,
  PencilLine,
  Trash,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const INPUT_TYPES = ["text", "number", "email", "password"] as const;

const InputTypesIcons: Record<(typeof INPUT_TYPES)[number], LucideIcon> = {
  text: PencilLine,
  number: Hash,
  email: Mail,
  password: AsteriskSquare,
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const inputCreatorSchema = z.object({
  label: z.string().min(1),
  defaultValue: z.string().optional(),
  type: z
    .union([
      z.literal("text"),
      z.literal("number"),
      z.literal("email"),
      z.literal("password"),
    ])
    .default("text"),
});

const createdFormSchema = z.object({
  inputs: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string(),
      type: z.enum(INPUT_TYPES),
    })
  ),
});

type InputCreatorFormFields = z.infer<typeof inputCreatorSchema>;

type CreatedFormFields = z.infer<typeof createdFormSchema>;

function formatCreatedFormData(data: CreatedFormFields): React.ReactNode {
  return (
    <p className="text-base">
      {data.inputs.map((input, index) => (
        <React.Fragment key={input.label}>
          {index !== 0 && ", "}
          <strong>{input.label}</strong>: {input.value}
        </React.Fragment>
      ))}
    </p>
  );
}

export default function Home() {
  const inputCreatorForm = useForm<InputCreatorFormFields>({
    resolver: zodResolver(inputCreatorSchema),
    defaultValues: {
      type: "text",
    },
  });
  const createdForm = useForm<CreatedFormFields>({
    resolver: zodResolver(createdFormSchema),
  });

  const {
    fields: inputs,
    append,
    remove,
    swap,
  } = useFieldArray({
    control: createdForm.control,
    name: "inputs",
  });

  const onCreateInput: SubmitHandler<InputCreatorFormFields> = (data) => {
    append({
      label: data.label,
      value: data.defaultValue ?? "",
      type: data.type,
    });
    inputCreatorForm.reset({
      label: "",
      defaultValue: "",
    });
  };

  const onCreatedFormSubmit: SubmitHandler<CreatedFormFields> = (data) => {
    toast(
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <PartyPopper size={20} />
          Answers submitted!
        </h3>
        {formatCreatedFormData(data)}
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col gap-8 items-center p-24">
      <Form {...inputCreatorForm}>
        <form
          onSubmit={inputCreatorForm.handleSubmit(onCreateInput)}
          className="space-y-8"
        >
          <h1 className="text-2xl font-bold">New input</h1>
          <FormField
            control={inputCreatorForm.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {inputCreatorForm.formState.errors.label && (
                  <FormMessage>
                    {inputCreatorForm.formState.errors.label.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={inputCreatorForm.control}
            name="defaultValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default value</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                {inputCreatorForm.formState.errors.defaultValue && (
                  <FormMessage>
                    {inputCreatorForm.formState.errors.defaultValue.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={inputCreatorForm.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {INPUT_TYPES.map((type) => {
                      const Icon = InputTypesIcons[type];
                      return (
                        <FormItem
                          key={type}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={type} />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <Icon size={20} />
                            {capitalizeFirstLetter(type)}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                {inputCreatorForm.formState.errors.type && (
                  <FormMessage>
                    {inputCreatorForm.formState.errors.type.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400"
          >
            Add
          </Button>
        </form>
      </Form>
      <Form {...createdForm}>
        <form
          onSubmit={createdForm.handleSubmit(onCreatedFormSubmit)}
          className="space-y-8"
        >
          <ul className="space-y-8">
            {inputs.map((input, index) => (
              <li key={input.id}>
                <FormField
                  control={createdForm.control}
                  name={`inputs.${index}.value` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{input.label}</FormLabel>
                      <FormControl>
                        <div className="grid grid-flow-col space-x-4">
                          <Input {...field} type={input.type} />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-destructive text-white hover:bg-destructive/80 flex items-center gap-2"
                          >
                            <Trash2 size={20} />
                            Remove
                          </Button>
                          {inputs.length > 1 && (
                            <Button
                              type="button"
                              className="flex items-center gap-2"
                              onClick={() =>
                                swap(
                                  index,
                                  index === 0 ? inputs.length - 1 : index - 1
                                )
                              }
                            >
                              {index === 0 ? (
                                <>
                                  <ArrowDown size={20} />
                                  Move down
                                </>
                              ) : (
                                <>
                                  <ArrowUp size={20} />
                                  Move up
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      {createdForm.formState.errors.inputs?.[index]?.value && (
                        <FormMessage>
                          {
                            createdForm.formState.errors.inputs[index]?.value
                              ?.message
                          }
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </li>
            ))}
          </ul>
          {inputs.length > 0 && (
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-400"
            >
              Submit
            </Button>
          )}
        </form>
      </Form>
    </main>
  );
}
