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

const INPUT_TYPES = ["text", "number", "email", "password"] as const;

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
  } = useFieldArray({
    control: createdForm.control,
    name: "inputs",
  });

  const onSubmit: SubmitHandler<InputCreatorFormFields> = (data) => {
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

  return (
    <main className="flex min-h-screen flex-col gap-8 items-center p-24">
      <Form {...inputCreatorForm}>
        <form
          onSubmit={inputCreatorForm.handleSubmit(onSubmit)}
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
                    {INPUT_TYPES.map((type) => (
                      <FormItem
                        key={type}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={type} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {capitalizeFirstLetter(type)}
                        </FormLabel>
                      </FormItem>
                    ))}
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
        <form className="space-y-8">
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
                        <div className="flex items-center space-x-4">
                          <Input {...field} type={input.type} />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-destructive text-white hover:bg-destructive/80"
                          >
                            Remove
                          </Button>
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
        </form>
      </Form>
    </main>
  );
}
